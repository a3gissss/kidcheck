# Demo Video: Script and Shot Plan

Length: about 2 minutes 45 seconds. Narration is about 330 words (2 minutes 20 seconds at a calm pace), plus pauses for the on-screen actions.
Every step shown works on the live site: https://kidcheck-three.vercel.app

## Before recording

| Step | Why |
|---|---|
| Use a fresh browser window (Edge or Chrome) at 1920×1080, zoom 110%, bookmarks bar hidden | Clean, readable frame |
| Open https://kidcheck-three.vercel.app. Go to **Case log** and press **Delete all cases** | The log starts empty, so only the demo cases appear |
| Do one full practice run of Shots 4 to 8 | Wakes up the server and confirms the AI is answering today |
| Have the GitHub README open in a second tab, scrolled to **AI evaluation** | For Shot 10 |
| Recorder: Windows **Win+Alt+R** (Game Bar), OBS, or Clipchamp. Record the narration separately if that is easier, then lay it over | |
| Close notifications (Windows **Focus**) | No pop-ups in the recording |

**If the AI is slow or unavailable on the day,** keep recording: the app shows "AI unavailable, using the manual checklist". Fill the same answers by hand and say: *"If the AI is down, the health worker fills the same checklist by hand, and the rules work exactly the same."* That is a real feature, not a failure.

## Shot list

| # | Time | On screen (exact actions) | Narration |
|---|---|---|---|
| 1 | 0:00–0:12 | Landing page, still. Slowly move the mouse over the headline. | "In many rural communities, the first person to see a sick child isn't a doctor. It's a community health worker, with a few weeks of training and a paper chart." |
| 2 | 0:12–0:30 | Scroll slightly so **The problem** is centred. | "Under pressure, danger signs get missed: a child who can't drink, or whose chest pulls in when they breathe. Those children need a health facility today, and every hour matters." |
| 3 | 0:30–0:48 | Hover over the three **How it works** steps, one at a time. | "KidCheck is a web app for that moment. The health worker describes the child in plain words. AI turns that into a checklist. The health worker checks every answer. Then fixed rules from the WHO and UNICEF chart booklet make the decision." |
| 4 | 0:48–1:00 | In **Start a case**, click **Fast breathing, vomiting**. Pause on the text. | "Here's a synthetic case: an 18-month-old boy, coughing for three days, breathing fast, and vomiting everything." |
| 5 | 1:00–1:15 | Click **Fill checklist with AI**. Wait. Scroll slowly past the purple notice and the answers marked **AI**. | "Gemini reads the description and fills only what was actually said: age, sex, cough for three days, vomits everything. Each one is marked AI, so the health worker knows to check it. Anything not mentioned stays 'Not asked'." |
| 6 | 1:15–1:35 | Set the remaining danger signs to **No** (convulsions, not able to drink, very sleepy, chest indrawing), Diarrhoea **No**, Fever **No**, Swelling **No**, MUAC **Green**. Type **52** in breaths. | "The health worker answers what the AI couldn't know: they count the breaths, 52 a minute, and look for the other danger signs. A sign they haven't checked is never treated as a 'no'." |
| 7 | 1:35–1:47 | Click **Save and see result**. Hold on the red full-screen alert for 2 seconds. | "One danger sign is enough. Vomiting everything means: refer urgently." |
| 8 | 1:47–2:05 | Click **See what to do**. Hover over "Vomits everything (chart p. 6)", then the steps. Click **Print referral note** and show the print preview for 2 seconds, then cancel. | "Every result says which sign triggered it and which page of the WHO chart it comes from, then lists what to do before the child leaves, with a referral note ready to print." |
| 9 | 2:05–2:15 | Click **Case log**. Hover over the case. | "Cases stay on the device. No names, and the AI never sees anything but the description." |
| 10 | 2:15–2:32 | Switch to the GitHub tab, already scrolled to **AI evaluation**. Hover over the table, then scroll briefly to **Testing**. | "The decision itself is plain, tested code: 168 automated tests. On 20 synthetic cases, including Nigerian Pidgin, the AI extracted every stated fact and missed no danger sign. And when it once guessed a 'no' it shouldn't have, we fixed the prompt." |
| 11 | 2:32–2:45 | Back to the landing page. Scroll down to **What KidCheck will not do**, then hold on the headline. | "KidCheck is a prototype, not a medical device, and it would need clinician review before real use. But the idea is simple: AI reads, the WHO rules decide, the health worker stays in charge. Plain words in, WHO-backed decisions out." |

## Editing notes

- Add a small caption over Shots 4 to 9: **"Synthetic demo case"**.
- Add a title card at 0:00 if the hackathon asks for one: *KidCheck · DSH Hacks V2 · AI x Healthcare*.
- End card (3 seconds): the live URL and `github.com/a3gissss/kidcheck`.
- Keep the amber disclaimer bar visible; do not crop it out.

## What not to say

- No numbers about deaths or missed cases (no source is cited in the project).
- Not "accurate", "validated" or "approved". Say "on 20 synthetic cases".
- Not "diagnoses". KidCheck classifies by the WHO chart; the health worker decides.
