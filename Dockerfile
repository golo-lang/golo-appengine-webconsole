FROM azul/zulu-openjdk:8
MAINTAINER Julien Ponge <julien.ponge@insa-lyon.fr>

RUN apt-get update
RUN apt-get -y upgrade
RUN apt-get install -y maven

ADD . /golo-console
RUN cd /golo-console && mvn dependency:go-offline package

EXPOSE 8080
ENTRYPOINT cd /golo-console && mvn jetty:run
