# Breath Calculator

# Useless Project 3.0 — “How Many Blows?” 🚲💨

## Project Overview

Build a fun, ridiculous, fully deployable web application for **TinkerHub Useless Project 3.0**.

The purpose of the application is to answer one extremely important scientific question:

> **“How many human blows would it take to fill this object with air?”**

The user uploads an image of an air-filled object such as a **bicycle tyre, motorcycle tyre, car tyre, football, basketball, volleyball, balloon, inflatable toy, etc.**

The application should identify what the object is, estimate its required air volume, and calculate how many human blows would theoretically be required to fill it.

The project should feel intentionally **useless, cartoonish, exaggerated and funny**, while still looking like a real working technology demonstration.

---

# 1. Core User Flow

The application should have this simple flow:

### Step 1 — Upload

Display a large funny upload area:

> 📸 “Show me the thing you want to suffer for.”

Allow the user to upload an image.

Supported formats:

* JPG

* JPEG

* PNG

* WEBP

Show a preview of the uploaded image.

---

### Step 2 — Identify the Object

Use a **Google Lens-like image recognition concept** to determine what the uploaded object is.

The system should classify the object into a practical category such as:

* Bicycle tyre

* Motorcycle tyre

* Car tyre

* Truck tyre

* Football

* Basketball

* Volleyball

* Balloon

* Inflatable toy

* Other inflatable object

The system should display:

> 🔍 “I have investigated the object…”

Then show:

**Detected object:** Bicycle tyre 🚲

and a confidence percentage if available.

Example:

> **Object detected:** Bicycle Tyre

> **Confidence:** 94%

### Important implementation constraint

Do NOT build or download a large custom computer-vision model.

This project must run on the **free/unsubscribed Render tier with limited RAM and runtime resources**.

Prefer one of these lightweight approaches:

1. A lightweight external image-recognition API, if available.

2. A vision-capable API such as Gemini Vision through an API key.

3. A very lightweight pretrained model only if it can run comfortably within Render's memory limits.

The backend should **not store large AI models locally**.

The application should be designed so that image processing happens through an external API whenever possible.

Keep API keys strictly on the backend using environment variables.

---

# 2. Estimate Air Volume

After identifying the object, estimate the approximate volume of air required to inflate it.

Do NOT pretend the volume is scientifically exact.

Clearly label it:

> “Estimated air volume”

Use a predefined lightweight database of approximate values for common objects.

Example starting values:

| Object               | Approximate Air Volume |

| -------------------- | ---------------------: |

| Bicycle tyre         |                  3–5 L |

| Motorcycle tyre      |                15–25 L |

| Car tyre             |                35–50 L |

| Truck tyre           |              150–300 L |

| Football             |                  5–7 L |

| Basketball           |                  7–9 L |

| Volleyball           |                  4–5 L |

| Balloon              |                10–15 L |

| Small inflatable toy |                 5–20 L |

These values can be adjusted or expanded.

For objects where exact dimensions cannot be determined from an image, use a reasonable category-based estimate.

Display:

> 💨 Estimated air required: **4.2 L**

Also include a tiny disclaimer:

> “Scientifically questionable. Emotionally accurate.”

---

# 3. Calculate Human Blows

Define a configurable average amount of air delivered per blow.

Use:

**Average air per blow = approximately 0.5 L**

Make this a configurable constant in the backend so it can easily be changed later.

Basic formula:

**Total Blows = Estimated Air Volume / Air Per Blow**

Round up to the nearest whole number.

Example:

4.2 L / 0.5 L = 8.4

Therefore:

> 💨 **Total Blows: 9**

Add a small random variation if desired, but keep the result reproducible enough that repeated calculations do not look completely arbitrary.

---

# 4. Calculate Inflation Time

Estimate inflation time using:

**Inflation Time = Total Blows × Average Seconds Per Blow**

Use an average of approximately:

**4 seconds per blow**

Optionally include a short rest between blows for larger objects.

For example:

* Small object → 3–4 sec/blow

* Medium object → 4–5 sec/blow

* Large object → 5–7 sec/blow

Display the result in a friendly format:

> ⏱️ Estimated inflation time: **1 minute 12 seconds**

Add a funny status:

> “Congratulations. You have chosen suffering.”

---

# 5. Estimated Air Expelled

Calculate the total amount of air the user would have expelled from their lungs.

For the basic calculation:

**Estimated Air Expelled = Total Blows × Air Per Blow**

Display:

> 🫁 Estimated air expelled: **4.5 litres**

Then add a humorous interpretation.

Examples:

* “That was basically a human-powered air compressor.”

* “Your lungs have filed a complaint.”

* “You have donated your oxygen to a tyre.”

---

# 6. Energy Wasted

Create a simple theoretical estimate of energy expenditure.

Do NOT attempt complex physiological modelling.

Use a simple configurable formula based on the number of blows.

For example:

**Energy Wasted = Total Blows × Energy Per Blow**

Use a small configurable value such as:

**0.5–1.5 kcal per blow**

The exact value should be clearly labelled as a humorous/theoretical estimate rather than medical or scientific fact.

Example:

> 🔥 Energy wasted: **7.2 kcal**

Then display a funny comparison:

> “Equivalent to approximately 0.3% of one biscuit.”

or

> “You burned enough energy to regret starting.”

Make the comparison dynamically selected from a small list.

---

# 7. Lung Exhaustion Percentage 🫁

Create a deliberately silly but understandable metric called:

## “Lung Exhaustion”

This is NOT a medical measurement.

It should be presented clearly as a **fun project metric**.

Calculate it using a simple capped formula based on the number of blows.

For example:

**Lung Exhaustion % = Total Blows × 2.5**

Cap the value at 100%.

Examples:

* 5 blows → 12.5%

* 20 blows → 50%

* 40 blows → 100%

Display it with a progress bar or animated meter.

Examples:

> 🫁 Lung Exhaustion: **37%**

Status:

* 0–20% → “Barely breathing 😌”

* 21–40% → “Getting suspicious 😐”

* 41–60% → “Breathing manually 😭”

* 61–80% → “Why did you agree to this? 💀”

* 81–99% → “Your lungs are negotiating 🫁”

* 100% → “CONTACT THE NEAREST PUMP. 🚨”

Include a disclaimer:

> “Lung Exhaustion is a completely unofficial metric created for entertainment.”

---

# 8. Funny Factor / Uselessness Score

The application should have a dedicated **Uselessness Score**.

Example:

## 🏆 Uselessness Score: 97%

Calculate it based on arbitrary humorous factors such as:

* Number of blows

* Inflation time

* Object ridiculousness

* Lung exhaustion

Do not make this scientifically meaningful.

Example:

> **Uselessness Score: 98.7%**

>

> “Technology has successfully solved a problem nobody had.”

Also generate a funny final verdict.

Possible verdicts:

* “Just use a pump.”

* “Congratulations. You reinvented the bicycle pump.”

* “Humanity has officially peaked.”

* “This could have been avoided with ₹50.”

* “Your lungs did not deserve this.”

* “AI has gone too far.”

* “NASA is not calling.”

* “Completely useless. 10/10.”

* “You spent computing power calculating something your local shopkeeper already knows.”

* “Science has left the building.”

Randomly select an appropriate message based on the result.

---

# 9. Results Dashboard

After calculation, show a large cartoonish results screen.

Example:

# 🚲 YOUR TYRE HAS BEEN JUDGED

**Detected Object:** Bicycle Tyre 🚲

**Estimated Air Required:** 4.2 L

Then show large result cards:

### 💨 Total Blows

**9**

### ⏱️ Inflation Time

**36 seconds**

### 🫁 Air Expelled

**4.5 L**

### 🔥 Energy Wasted

**6.8 kcal**

### 🫁 Lung Exhaustion

**22.5%**

### 🏆 Uselessness Score

**94%**

Then:

> ### FINAL VERDICT

>

> **“Just buy a pump.”**

Add a button:

### 🔄 “Make Me Suffer Again”

which returns to the upload screen.

---

# 10. Cartoonish UI Design

The UI should NOT look like a corporate dashboard.

It should look like a combination of:

* Cartoon science experiment

* Internet meme

* Children's science fair

* Silly startup

* Slightly broken AI laboratory

Use:

* Rounded cards

* Big playful typography

* Emoji

* Funny microcopy

* Bouncy animations

* Cartoon-style illustrations/icons

* Progress bars

* Large numbers

* Speech bubbles

* Slightly exaggerated UI elements

Suggested visual theme:

**Background:** light/off-white

Use a playful combination of:

* Yellow

* Sky blue

* Orange

* Green

* Pink

Avoid making it visually overwhelming.

Use a clean modern font with a playful heading font if available.

---

# 11. Landing Page

The landing page should immediately explain the absurdity.

Hero heading:

> ## HOW MANY BLOWS? 💨

Subheading:

> **Because apparently, we needed technology to answer this.**

Supporting text:

> Upload a tyre, ball, balloon or any inflatable object.

> Our highly unnecessary AI will calculate how many human blows it takes to fill it.

Button:

> 🚀 CALCULATE MY SUFFERING

Small text:

> “Powered by questionable science and unnecessarily advanced technology.”

---

# 12. Loading Animation

While identifying the object, show funny rotating messages.

Examples:

> 🔍 Asking AI what this thing is…

> 🧠 Consulting the world's most unnecessary database…

> 📐 Doing extremely serious mathematics…

> 🫁 Measuring imaginary lung damage…

> 💨 Counting imaginary breaths…

> 🤖 Making technology regret its existence…

Rotate these messages during API processing.

---

# 13. Error Handling

If the image cannot be identified:

Show:

> 🤔 I have no idea what this is.

Then:

> “Try uploading a clearer picture of a tyre, ball, balloon or another inflatable object.”

Button:

> 🔄 TRY AGAIN

If API failure occurs:

Do NOT crash the application.

Use a graceful fallback.

The system can ask the user to manually select the object category.

Example:

> “Our AI is taking a nap. Pick the object manually.”

Buttons:

🚲 Bicycle

🏍️ Bike

🚗 Car

⚽ Ball

🎈 Balloon

🛟 Other

This fallback is extremely important for deployment reliability.

---

# 14. Technical Architecture

Keep the application lightweight.

Recommended architecture:

### Frontend

Use:

* React

* Vite

* Tailwind CSS

Avoid unnecessarily large UI libraries.

### Backend

Use:

* Python

* Flask

The backend should expose lightweight API endpoints such as:

`POST /api/analyze`

and

`POST /api/calculate`

Keep the backend stateless wherever possible.

### Database

A database is NOT required for the core functionality.

Store object specifications in a simple Python dictionary or lightweight JSON file.

Do not introduce PostgreSQL/MongoDB unless absolutely necessary.

---

# 15. Render Free-Tier Optimization

This project MUST be designed for a free/unsubscribed Render deployment.

Important requirements:

### Memory

Do NOT:

* Download huge ML models

* Run heavy computer vision locally

* Use PyTorch unless absolutely necessary

* Use TensorFlow unless absolutely necessary

* Keep large image datasets

* Run background workers

* Run unnecessary processes

Prefer external vision APIs.

### Image handling

Resize uploaded images before sending them to the vision API.

Limit uploads to approximately:

**5 MB maximum**

Convert/compress images where appropriate.

Do not permanently store uploaded images.

Delete temporary files after processing.

### API design

Keep requests short and stateless.

Do not use WebSockets unless necessary.

Do not use Redis.

Do not use Celery.

Do not use background workers.

Do not use unnecessary databases.

The application should be capable of running as a **single lightweight Flask service + frontend**.

---

# 16. API Key Security

Never expose API keys in the frontend.

Use environment variables such as:

`GEMINI_API_KEY`

If an external vision API is used:

* API calls must happen from Flask

* API keys must remain server-side

* Include a `.env.example`

* Explain required Render environment variables in the README

Never commit `.env` to GitHub.

---

# 17. Vision Recognition Prompt

When sending the image to the vision model, use a concise classification instruction similar to:

“Identify the main inflatable object in this image. Return only the most likely category from this list: bicycle tyre, motorcycle tyre, car tyre, truck tyre, football, basketball, volleyball, balloon, inflatable toy, other. Also provide a confidence estimate from 0 to 100. Do not hallucinate detailed physical dimensions.”

The backend should parse the response safely.

If the model gives an unknown result, fall back to manual selection.

---

# 18. Calculation Engine

Keep all calculations in a separate backend module.

Example conceptual structure:

```text

backend/

│

├── app.py

├── calculator.py

├── object_data.json

├── requirements.txt

└── .env.example

```

The calculator should contain configurable constants:

```text

AIR_PER_BLOW

SECONDS_PER_BLOW

ENERGY_PER_BLOW

```

Object data should contain:

```text

object_name

estimated_volume

category

```

This makes the system easy to modify later.

---

# 19. Transparency

Because the calculations are intentionally approximate, include a small:

### “How did we calculate this?”

section.

Example:

> We estimate the object's air volume using a predefined approximate value for its category.

> We assume one human blow provides roughly 0.5 L of air.

> We then estimate the number of blows, inflation time and other silly statistics.

Add:

> **This is an entertainment project, not a medical, engineering or tyre-inflation measurement tool.**

---

# 20. Easter Eggs

Add several hidden/funny responses.

If the user uploads a bicycle:

> “Ah yes. The classic human-powered bicycle pump.”

If they upload a car tyre:

> “You have made a terrible decision.”

If they upload a balloon:

> “Finally, a reasonable opponent.”

If the estimated blow count exceeds 100:

> “Please stop. Buy a pump.”

If it exceeds 500:

> “THIS IS NO LONGER A PROJECT. THIS IS A CRY FOR HELP.”

If the object is not inflatable:

> “This object appears to contain 0% willingness to be inflated.”

---

# 21. Optional Share Result

Add a simple button:

> 📸 “Expose My Suffering”

This can generate a shareable result card using HTML/CSS or browser screenshot functionality if lightweight.

The card should contain:

**HOW MANY BLOWS?**

Object: Bicycle Tyre

Blows: 9

Lung Exhaustion: 22%

Uselessness Score: 94%

> “I used AI to calculate something a pump could solve.”

Do not introduce a heavy image-generation service for this.

---

# 22. Deployment Requirements

The final project must be deployable.

Provide:

* Complete frontend code

* Complete Flask backend

* `requirements.txt`

* `package.json`

* `.env.example`

* `render.yaml` if useful

* README with setup instructions

* Local development instructions

* Render deployment instructions

The application should work with:

```text

npm install

npm run dev

```

for the frontend and:

```text

pip install -r requirements.txt

python app.py

```

for the backend.

Make the production configuration suitable for Render.

Use a production WSGI server such as Gunicorn if required.

---

# 23. Important Product Philosophy

Do NOT over-engineer this project.

The goal is not to create a serious tyre analysis system.

The goal is:

**“Use unnecessarily advanced technology to calculate something completely unnecessary.”**

Prioritize:

1. It works.

2. It is funny.

3. It is visually memorable.

4. It is lightweight.

5. It deploys reliably on Render's free tier.

6. The AI/image recognition actually works.

7. The calculations are understandable.

8. The application does not require expensive infrastructure.

Avoid unnecessary features that increase memory usage or deployment complexity.

---

# 24. Final Experience

The entire application should feel like the user has entered a ridiculous laboratory built by students who had too much free time.

The final tone should be:

**50% AI demo + 30% cartoon + 20% absolute nonsense.**

The project should make judges laugh while still demonstrating:

* Computer vision

* API integration

* Backend development

* Mathematical modelling

* Responsive UI

* Deployment

* Practical software engineering

The central joke should remain:

> **“We used AI to determine how many times you need to blow into a tyre instead of using a pump.”**

Build the project as a polished but intentionally ridiculous **Useless Project 3.0** submission.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://oothedaa.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/97f5423a-8b69-42c6-9a0c-9676b7d37efd).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
