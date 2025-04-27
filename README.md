This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Email Scheduler Service
To start email-scheduler-service you need to execute the command inside the 
/email-scheduler-service folder: npm start


## ТЗ

Этот проект изначально планировался с использованием стека Prisma, PostgreSQL и Clerk.
Однако в итоге я решил использовать Firebase Auth и Firestore. Основная причина такого выбора — Firestore является базой данных реального времени, что идеально подходило для данной задачи, поскольку нужно было получать доступ к базе каждую минуту без задержек.
Также я хотел, чтобы всё находилось в одном сервисе, чтобы избежать потенциальных конфликтов.Для аутентификации был использован Firebase Google Provider.

На сайте есть корневая страница, которая отображается неавторизованным пользователям.
Авторизованные пользователи автоматически перенаправляются на /dashboard.
В dashboard авторизованные пользователи могут просматривать свои запланированные email-сообщения, удалять их, редактировать контент и планировать новые письма.

Я также интегрировал функцию с использованием LLM (OpenAI GPT-4o-mini), которая преобразует текст в смайлики. Причина добавления этой функции связана с тем, что примерно 5 лет назад я увидел рекламу одного клона WhatsApp, где люди общались исключительно с помощью эмодзи. Эта идея меня вдохновила.

Пользователи могут планировать отправку писем как минимум на 3 минуты вперёд.
Кроме того, они могут удалять и редактировать письма только в том случае, если до момента отправки осталось более 3 минут.
Я намеренно добавил это ограничение, чтобы избежать возможных конфликтов в момент отправки писем.

Также я разработал отдельный микросервис под названием email-scheduler-service, который написан на Express и деплоится отдельно как backend.
В нём я использовал node-cron, чтобы каждую минуту забирать данные из Firestore и сверять дату и время отправки с текущим временем.
Если дата и время совпадают, сервис вызывает эндпоинт /api/email-delivery.
Дополнительно сервис проверяет письма, у которых дата уже прошла, а статус всё ещё "Pending" — такие письма также отправляются через /api/email-delivery, чтобы гарантировать доставку всех сообщений.

Вся логика отправки email реализована в /api/email-delivery.
Для отправки писем я использовал сервис Resend — он оказался очень удобным и простым в использовании.
Письма отправляются от лица моего домена: From: "Email Time Capsule <noreply@sultantemuruly.blog>" Однако чтобы получатель понимал, кто именно отправил ему письмо, я добавил в тело письма следующую разметку: <h2>${userData.email} is sending you:</h2>
<p>${emailData.content.replace(/\n/g, "<br>")}</p> 
В итоге письмо выглядит, например, так:
Email Time Capsule noreply@sultantemuruly.blog
8:52 AM (5 hours ago)
to me

sultantemuruly@gmail.com is sending you:
Hi there! Для реализации отправки от своего домена мне пришлось купить домен sultantemuruly.blog, так как без верифицированного домена Resend не позволяет отправлять письма.
Я не реализовывал ранее подобную логику, поэтому не знал, как сделать отправку письма напрямую от имени пользователя. Но считаю, что моя текущая реализация вполне приемлема.

Наиболее сложной частью проекта была реализация проверки даты и времени отправки каждую минуту. Изначально я пытался использовать Redis и useFetch, но быстро понял, что если пользователь обновит страницу или выйдет из аккаунта, счётчик будет останавливаться или лагать. После долгих экспериментов я пришёл к решению вынести эту логику на отдельный бекенд-сервис, который работает постоянно на сервере (email-scheduler-service который я упомянул ранее).

У приложения есть некоторые ограничения:

1.Проверка времени происходит по часовому поясу Казахстана (UTC+5).
Это значит, что пользователи из других часовых поясов могут столкнуться с тем, что письма будут отправляться немного раньше или позже назначенного времени.

2.Если пользователь введёт несуществующий email, приложение всё равно покажет статус "Sent", а не "Failed".Это недоработка, которую я планирую исправить в будущем.

Кроме этого, других серьёзных ошибок или ограничений на данный момент я не выявил.
Что касается выполнения технического задания, я реализовал все фичи, кроме загрузки файлов Я понимаю, что возможность прикреплять файлы к письмам является важной функцией, однако я получил текст задания второго тура в среду вечером и увидел его только в четверг утром, и у меня было всего 4 дня на выполнение задачи (из которых четверг и пятница были заняты школой. В школе я пытался кодить но было мало концентрации для того чтобы работать на приложением). Поэтому прошу с пониманием отнестись к отсутствию данной фичи.

Также я отдельно обратил внимание на пункт: Все внешние сервисы (external APIs and services) должны быть вызваны с серверной части приложения.
Этот пункт я выполнил на 100%: если посмотреть на структуру проекта и код, видно, что все внешние ключи используются только на серверной части.

Для дизайна я в основном использовал v0.dev.

В целом, несмотря на небольшие ограничения, приложение вполне соответствует требованиям MVP.