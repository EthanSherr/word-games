## Email Configuration

The app will send email alerts to users who are signed up to receive them. Some configuration is needed for sending emails. In order to configure these email services correctly you need to export WG_EMAIL_NOTIFIER_HOST, WG_EMAIL_NOTIFIER_EMAIL, WG_EMAIL_NOTIFIER_PASSWORD in your envirnment. We'll export those WG_EMAIL\* settings. Then the `packages/backend/.env` will substitude those variables in VITE_EMAIL_NOTIFIER_HOST, VITE_EMAIL_NOTIFIER_EMAIL, VITE_EMAIL_NOTIFIER_PASSWORD respectively. To accomplish this:

1. make a .env in `packages/backend/secrets/.env`

This is an untracked folder. In there, export WG_EMAIL\* variables such as:

```sh
WG_EMAIL_NOTIFIER_HOST="smtp.gmail.com"
WG_EMAIL_NOTIFIER_EMAIL="my-notifier-email@gmail.com"
WG_EMAIL_NOTIFIER_PASSWORD="tee hee hee or whatever the pass is from gmail"
```

2. Now, to pick these secrets up from you `secrets/.env` you'll have to run

```sh
source secrets/.env
```

After doing this you should be able to `echo $WG_EMAIL_NOTIFIER_EMAIL` and it'll print what's in your secrets/.env.

3. Now you can `pnpm start` your develpment server or do your build, and the email notifier will function correctly.
