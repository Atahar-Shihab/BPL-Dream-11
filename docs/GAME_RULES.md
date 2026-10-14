# BPL Dream 11 — Official Game Rules & Fantasy Scoring Guide

## 1. Squad Assembly Constraints
1. **Squad Size Limit**: Exactly 6 players per fantasy squad.
2. **Coin Budget**: Starting grant of 150,000 coins (or user custom balance).
3. **Overseas Quota**: Maximum of 4 international players per lineup, mirroring official BPL franchise rules.
4. **Wicketkeeper Mandate**: Every valid squad must feature at least 1 specialist Wicketkeeper (`WK-Batsman`).

---

## 2. Leadership Multipliers
- **Captain (C)**: Earns **2.0x** of all standard match fantasy points.
- **Vice-Captain (VC)**: Earns **1.5x** of all standard match fantasy points.
- Duplicate roles on the same cricketer are rejected by live validation.

---

## 3. Fantasy Scoring System
Based on the official T20 fantasy points calculation model (`src/data/fantasyScoringTable.json`):

### Batting Points
- Each Run Scored: **+1 pt**
- Boundary Four (4): **+1 pt bonus**
- Boundary Six (6): **+2 pt bonus**
- Half-Century Milestone (50 runs): **+8 pt bonus**
- Century Milestone (100 runs): **+16 pt bonus**
- Strike Rate Bonus (SR > 170, min 10 balls): **+6 pt bonus**

### Bowling Points
- Wicket Taken (excluding run-outs): **+25 pts**
- 3-Wicket Haul Milestone: **+4 pt bonus**
- 5-Wicket Haul Milestone: **+16 pt bonus**
- Maiden Over Bowled: **+12 pts**
- Economy Rate Bonus (Econ < 5.0): **+6 pt bonus**

### Fielding Points
- Catch Completed: **+8 pts**
- Stumping: **+12 pts**
- Direct Hit Run-Out: **+12 pts**

---

## 4. BPL Match Simulator Mini-Game
- 5-over simulated T20 chase against premier BPL franchises:
  - *Comilla Victorians* (9.4 Rating)
  - *Fortune Barishal* (9.3 Rating)
  - *Rangpur Riders* (9.2 Rating)
  - *Sylhet Strikers* (9.1 Rating)
- Ball-by-ball simulated outcomes weighted by squad batting strength and bowler ratings.
- Victory rewards user with **+15,000 Coins** directly added to their live balance.
