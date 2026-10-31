export const SITE = {
  name: "VoteWalk",
  tagline: "Every step to the ballot, for your state.",
  description:
    "Walk through how to vote in the November 3, 2026 US midterm election. A 3D polling-place guide with state-by-state registration deadlines, voter ID rules, early voting, mail ballots, accessibility rights and official hotlines, sourced from government and nonpartisan election authorities.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://votewalk.vercel.app",
  electionDate: "2026-11-03",
};

export interface Station {
  id: string;
  short: string;
  title: string;
  question: string; // AEO: the literal question people search
  summary: string; // one-paragraph direct answer
  points: string[];
  sources: { label: string; url: string }[];
}

export const STATIONS: Station[] = [
  {
    id: "eligibility",
    short: "Who can vote",
    title: "Check that you are eligible",
    question: "Who can vote in the 2026 US midterm election?",
    summary:
      "You can vote if you are a US citizen, will be 18 on or before November 3, 2026, meet your state's residency rules and are registered by your state's deadline. North Dakota has no registration. Rules for people with felony convictions vary by state.",
    points: [
      "US citizens only. Permanent residents and visa holders cannot vote in federal elections.",
      "You can be experiencing homelessness and still register and vote.",
      "Citizens living abroad vote in the state where they last lived.",
      "Maine, Vermont and DC never remove the vote for a felony; 23 states restore it automatically on release from prison; the rest wait until the sentence ends or require an application.",
    ],
    sources: [
      { label: "USA.gov: Who can vote", url: "https://www.usa.gov/who-can-vote" },
      { label: "NCSL: Felony voting rights", url: "https://www.ncsl.org/elections-and-campaigns/felon-voting-rights" },
    ],
  },
  {
    id: "register",
    short: "Register",
    title: "Register, or check that you still are",
    question: "How do I register to vote and what is the deadline?",
    summary:
      "Start at vote.gov, which sends you to your state's official registration or status-check tool. Most 2026 deadlines fell between October 4 and October 29. If you missed yours, 23 states plus DC let you register and vote on the same day during early voting or on Election Day.",
    points: [
      "Check your status even if you registered years ago; moves and list maintenance can drop you.",
      "Online registration exists in 42 states plus DC. The rest take the National Mail Voter Registration Form or in-person forms at the DMV.",
      "Same-day registration usually needs proof of residence such as a license, utility bill or lease.",
      "Federal law bars states from systematically purging voters within 90 days of a federal election.",
    ],
    sources: [
      { label: "vote.gov", url: "https://vote.gov" },
      { label: "NCSL: Registration deadlines", url: "https://www.ncsl.org/elections-and-campaigns/voter-registration-deadlines" },
      { label: "NCSL: Same-day registration", url: "https://www.ncsl.org/elections-and-campaigns/same-day-voter-registration" },
    ],
  },
  {
    id: "id",
    short: "Bring ID",
    title: "Know what ID to bring",
    question: "Do I need ID to vote and which ID is accepted?",
    summary:
      "It depends on your state. Ten states require a photo ID with no fallback (you cast a provisional ballot and must follow up). Fourteen ask for a photo ID but accept an affidavit if you lack one. Eleven accept non-photo ID. Fourteen states plus DC need no document from most voters. First-time voters who registered by mail may be asked for ID anywhere under federal law.",
    points: [
      "If you have a driver's license or state ID, bring it. It is accepted everywhere that asks for ID.",
      "No ID in a strict state? Still vote. Ask for a provisional ballot and follow the deadline to show ID afterward (often 3 to 6 days).",
      "Expired IDs, student IDs and tribal IDs are accepted in some states and not others; check your state's list.",
    ],
    sources: [{ label: "NCSL: Voter ID laws", url: "https://www.ncsl.org/elections-and-campaigns/voter-id" }],
  },
  {
    id: "ways",
    short: "Choose how",
    title: "Pick early, mail or Election Day",
    question: "Can I vote early or by mail in 2026?",
    summary:
      "Forty-seven states plus DC offer some form of early in-person voting without an excuse. Thirty-seven states plus DC let anyone vote by mail, and eight states plus DC mail a ballot to every voter. In 35 states a mail ballot must arrive by Election Day, so if you still hold one, use a drop box or return it in person.",
    points: [
      "Early voting windows run from mid-September (Idaho, Minnesota, South Dakota, Virginia) to the day before Election Day in 14 states.",
      "Only 15 states plus DC count mail ballots postmarked by Election Day that arrive later. The Supreme Court upheld those grace periods in June 2026 (Watson v. RNC).",
      "Track your mail ballot on your state's lookup tool. Most states let you fix a missing or mismatched signature; deadlines vary.",
      "Polls generally open between 6 and 8 a.m. and close between 6 and 9 p.m. local time. Clocks change on Nov 1, so Election Day is on standard time.",
    ],
    sources: [
      { label: "CEIR: 2026 early and mail voting dates", url: "https://electioninnovation.org/research/dates-for-2026-early-in-person-and-mail-voting/" },
      { label: "NCSL: Mail ballot receipt deadlines", url: "https://www.ncsl.org/elections-and-campaigns/table-11-receipt-and-postmark-deadlines-for-absentee-mail-ballots" },
    ],
  },
  {
    id: "ballot",
    short: "Mark the ballot",
    title: "What is on the ballot and how to mark it",
    question: "What is on the ballot in the November 2026 midterm election?",
    summary:
      "All 435 US House seats, 35 US Senate seats (33 regular plus special elections in Ohio and Florida), 36 governors, plus state legislatures, local offices, judges and ballot measures. Your state's sample ballot shows exactly what you will see.",
    points: [
      "Fill ovals or arrows completely with the pen provided. Do not sign or mark outside the boxes.",
      "You may skip any race. A blank race does not spoil the ballot.",
      "Made a mistake? Ask a poll worker for a new ballot before you cast it. You are usually allowed up to three.",
      "Every polling place must have at least one accessible voting machine with audio, large print and tactile or sip-and-puff controls.",
    ],
    sources: [
      { label: "Ballotpedia News: 2026 Senate and governor races", url: "https://news.ballotpedia.org/2026/03/09/both-gubernatorial-and-u-s-senate-elections-are-happening-in-26-states-in-2026/" },
    ],
  },
  {
    id: "access",
    short: "Accessibility",
    title: "Your accessibility and language rights",
    question: "What are my rights as a voter with a disability?",
    summary:
      "Under the ADA and the Help America Vote Act you have the right to an accessible polling place, an accessible voting machine, help from a person you choose (except your employer or union agent), and curbside voting where the building is not accessible. Covered areas must also provide materials in Spanish, Asian, Native American and Alaska Native languages under Section 203 of the Voting Rights Act.",
    points: [
      "Accessible parking, a wheelchair-accessible route, 32-inch doorways and an accessible machine are required at every site.",
      "You do not have to prove a disability to get assistance.",
      "Blind and low-vision voters can request an accessible absentee ballot in many states, marked with a screen reader.",
      "Problems? Call the DOJ ADA line at 800-514-0301 (TTY 800-514-0383) or your state's Protection and Advocacy agency.",
    ],
    sources: [
      { label: "ADA.gov: Protecting voter rights", url: "https://www.ada.gov/resources/protecting-voter-rights" },
      { label: "vote.gov: Voters with disabilities", url: "https://vote.gov/guide-to-voting/disability" },
      { label: "EAC: Voting accessibility", url: "https://www.eac.gov/voting-accessibility" },
    ],
  },
  {
    id: "help",
    short: "Get help",
    title: "If something goes wrong",
    question: "What do I do if my name is not on the voter list or someone tries to stop me from voting?",
    summary:
      "If you are in line when polls close, stay in line; you can still vote. If your name is missing, ask the poll worker to re-check, confirm you are at the right site, register on the spot where allowed, or ask for a provisional ballot, which is your federal right. Report intimidation to the Department of Justice at 1-800-253-3931 and call 911 for threats or violence.",
    points: [
      "DOJ Civil Rights Division voting line: 1-800-253-3931, staffed all day on Election Day.",
      "Nonpartisan legal help: Election Protection, 866-OUR-VOTE (866-687-8683).",
      "Suspected election crimes: FBI, 1-800-CALL-FBI.",
      "Your state election office is listed at usa.gov/election-office.",
    ],
    sources: [
      { label: "DOJ Civil Rights: Report a violation", url: "https://civilrights.justice.gov/" },
      { label: "USA.gov: Find your election office", url: "https://www.usa.gov/election-office" },
    ],
  },
  {
    id: "overseas",
    short: "Abroad or military",
    title: "Voting from overseas or in the military",
    question: "How do US citizens abroad and service members vote?",
    summary:
      "Use the Federal Post Card Application at fvap.gov to register and request a ballot in one step. States had to send ballots by September 19, 2026. If your ballot has not arrived, vote the Federal Write-In Absentee Ballot as a backup and return your official ballot too if it shows up; only one counts.",
    points: [
      "Send forms to your local election office, not to FVAP.",
      "Nineteen states plus DC accept military and overseas ballots postmarked by Election Day that arrive up to several weeks later.",
      "Submit a new FPCA every January and whenever you move.",
    ],
    sources: [{ label: "FVAP.gov", url: "https://www.fvap.gov" }],
  },
];

export const HOTLINES = [
  { name: "DOJ voting rights", number: "1-800-253-3931", url: "https://civilrights.justice.gov/" },
  { name: "Election Protection (nonpartisan)", number: "866-OUR-VOTE", url: "https://866ourvote.org" },
  { name: "ADA information line", number: "800-514-0301", url: "https://www.ada.gov" },
  { name: "FBI election crimes", number: "1-800-CALL-FBI", url: "https://tips.fbi.gov" },
];

export const KEY_DATES = [
  { date: "Sep 18", what: "Earliest early voting opens (ID, MN, SD, VA)" },
  { date: "Sep 19", what: "Deadline for states to send military and overseas ballots" },
  { date: "Oct 4 to 29", what: "Registration deadlines in states without same-day registration" },
  { date: "Nov 1", what: "Clocks fall back; Election Day is on standard time" },
  { date: "Nov 3", what: "Election Day" },
  { date: "Nov 4 to 23", what: "Receipt deadlines for postmarked mail ballots in grace-period states" },
];
