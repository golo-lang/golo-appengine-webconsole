package org.gololang.webconsole;

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
import java.nio.charset.Charset;
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
