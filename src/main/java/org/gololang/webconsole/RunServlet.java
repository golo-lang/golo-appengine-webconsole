package org.gololang.webconsole;

import com.google.appengine.api.capabilities.Capability;
import com.google.apphosting.api.ApiProxy;
import com.google.apphosting.api.ApiProxy.ApiConfig;
import com.google.apphosting.api.ApiProxy.ApiProxyException;
import com.google.apphosting.api.ApiProxy.Delegate;
import com.google.apphosting.api.ApiProxy.Environment;
import com.google.apphosting.api.ApiProxy.LogRecord;
import com.google.common.base.Charsets;
import com.google.common.io.ByteStreams;
import com.google.common.io.CharStreams;
import fr.insalyon.citi.golo.compiler.GoloCompilationException;
import fr.insalyon.citi.golo.compiler.parser.ParseException;
import fr.insalyon.citi.golo.compiler.parser.TokenMgrError;
import fr.insalyon.citi.golo.runtime.GoloClassLoader;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.lang.reflect.Field;
import java.nio.charset.Charset;
import java.util.HashSet;
import java.util.List;
import java.util.concurrent.Future;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class RunServlet extends HttpServlet {
  
  public static class Context {
    
    private StringBuilder builder = new StringBuilder();
    
    public Context log(Object obj) {
      builder.append(obj).append("\n");
      return this;
    }
  }
  
  @Override
  public void init() throws ServletException {
    super.init();
    final HashSet<String> forbidden = new HashSet<String>() {
      {
        for (Field field : Capability.class.getFields()) {
          if (field.getType() == Capability.class) {
            try {
              Capability cap = (Capability) field.get(null);
              add(cap.getPackageName());
            } catch (IllegalArgumentException | IllegalAccessException ex) {
              throw new ServletException(ex);
            }
          }
        }
      }
    };
    final Delegate delegate = ApiProxy.getDelegate();
    ApiProxy.setDelegate(new Delegate() {

      @Override
      public byte[] makeSyncCall(Environment env, String packageName, String methodName, byte[] request) throws ApiProxyException {
        if (forbidden.contains(packageName)) {
          throw new ApiProxyException("Access to " + packageName + " is forbidden");
        }
        return delegate.makeSyncCall(env, packageName, methodName, request);
      }

      @Override
      public Future makeAsyncCall(Environment env, String packageName, String methodName, byte[] request, ApiConfig config) {
        if (forbidden.contains(packageName)) {
          throw new ApiProxyException("Access to " + packageName + " is forbidden");
        }
        return delegate.makeAsyncCall(env, packageName, methodName, request, config);
      }

      @Override
      public void log(Environment env, LogRecord record) {
        delegate.log(env, record);
      }

      @Override
      public void flushLogs(Environment env) {
        delegate.flushLogs(env);
      }

      @Override
      public List getRequestThreads(Environment env) {
        return delegate.getRequestThreads(env);
      }
    });
  } 
  
  @Override
  protected void doPost(HttpServletRequest request, HttpServletResponse response)
          throws ServletException, IOException {
    response.setContentType("text/plain");
    try (InputStreamReader reader = new InputStreamReader(request.getInputStream(), Charsets.UTF_8)) {
      String code = CharStreams.toString(reader);
      try (ByteArrayInputStream codeStream = new ByteArrayInputStream(code.getBytes())) {
        GoloClassLoader classLoader = new GoloClassLoader(RunServlet.class.getClassLoader());
        Class<?> module = classLoader.load("test.golo", codeStream);
        try {
          Context context = new Context();
          context.log("-> run returned: " + module.getMethod("run", Object.class).invoke(null, context));          
          response.getWriter().write(context.builder.toString());
        } catch (Throwable t) {
          if (t.getMessage() == null) {
            response.getWriter().write(t.getCause().toString());
          }
        }
      } catch (GoloCompilationException e) {
        if (e.getCause() != null) {
          response.getWriter().write(e.getCause().getMessage());
        }
        for (GoloCompilationException.Problem problem : e.getProblems()) {
          response.getWriter().write(problem.getDescription());
        }
      } catch (TokenMgrError e) {
        response.getWriter().write(e.getMessage());
      }
    }
  }
}
