FROM phusion/passenger-full:2.1.0

RUN bash -lc 'rvm --default use ruby-2.7.5'

RUN mv /etc/apt/sources.list.d /etc/apt/sources.list.d.bak
RUN apt update && apt install -y ca-certificates
RUN mv /etc/apt/sources.list.d.bak /etc/apt/sources.list.d

# Set correct environment variables.
ENV HOME /root
ENV RAILS_ENV production

RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list

RUN apt-get update && apt-get install -y tzdata yarn

CMD ["/sbin/my_init"]

RUN apt install -y shared-mime-info iptables

RUN rm /etc/nginx/sites-enabled/default
ADD docker/webapp.conf /etc/nginx/sites-enabled/webapp.conf
ADD docker/postgres-env.conf /etc/nginx/main.d/postgres-env.conf

RUN mkdir /home/app/webapp
WORKDIR /home/app/webapp

COPY gadc-vision ./gadc-vision
COPY Gemfile .
COPY Gemfile.lock .
RUN bundle install

COPY . /home/app/webapp

RUN rake assets:precompile

RUN rm -f /etc/service/nginx/down
RUN rm -f /etc/service/redis/down

RUN rm -rf docker

# Clean up APT when done.
RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*