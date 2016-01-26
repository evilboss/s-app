#!/usr/bin/env bash

#export VELOCITY_DEBUG=0

# these are about to get canned
export JASMINE_CLIENT_UNIT=0
export JASMINE_SERVER_UNIT=0

export JASMINE_CLIENT_INTEGRATION=1
export JASMINE_SERVER_INTEGRATION=1
export CUCUMBER=1
export MAIL_URL="smtp://postmaster%40sandbox40d144b9ba9c4577b0bbd0d9ba4af634.mailgun.org:aed532135628254c0343b4e04b7347fe@smtp.mailgun.org:587";

if [ "$1" = "--test" ]; then
  export CUCUMBER_TAIL=1;
fi

cd app
#meteor $1 --settings ../environments/local/settings.json --release velocity:METEOR@1.1.0.3_2 --raw-logs
#TODO: this might cause issues with running apps slower. We can remove this if we need to..
meteor reset
meteor $1 --settings ../environments/local/settings.json