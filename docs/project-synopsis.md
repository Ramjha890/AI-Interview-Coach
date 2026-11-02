# InterviewIQ — B.Tech CSE Project Synopsis Outline

## Title

InterviewIQ: AI-Powered Interview Preparation and Evaluation System

## Abstract

InterviewIQ is a web application concept for structured interview practice. A user creates an account, selects a role and difficulty, responds to a practice question, and reviews feedback and saved progress. The implemented prototype uses locally generated sample prompts and a clearly identified heuristic feedback mode; it does not currently connect to an AI provider. A future provider-backed version can generate personalized questions and evaluate answers using a transparent rubric.

## Problem statement

Candidates often lack an accessible, repeatable way to practice explaining technical and behavioral experience and to track preparation over time. InterviewIQ explores how a private web application can organize practice and provide feedback in one workflow.

## Objectives

- Provide a responsive interview practice interface.
- Validate user identity and keep practice records scoped to the account owner.
- Save answers and show progress derived from persisted records.
- Extract readable text from PDF resumes for user review.
- Establish an API and data model that can be extended with validated AI services.

## Scope and limitations

The current prototype supports account registration/login, one local practice question per session, a disclosed four-category evidence-indicator rubric, a dashboard summary, record deletion, in-memory PDF text extraction, and report PDF export. It does not implement a real AI provider, full resume analysis, multi-question sessions, advanced analytics, administrator capabilities, or migration tooling. Heuristic feedback must not be presented as a definitive assessment.

## Technology stack

React and Vite; Python and FastAPI; Pydantic; SQLAlchemy; SQLite development database; JWT access tokens; Argon2 password hashing; PyMuPDF PDF extraction.

## System modules

1. Authentication and account access.
2. Interview setup and local question generation.
3. Answer submission and demonstration feedback.
4. Dashboard and practice history.
5. PDF resume text extraction.

## Data model

`User` has a unique email and password hash. `Interview` belongs to one user through a foreign key and stores role, difficulty, question, answer, score, feedback, and creation time. Ownership predicates protect record access.

## Methodology and evaluation

The prototype uses API validation, relational persistence, and a browser client. Included automated smoke tests exercise health, protected access, registration, interview creation, and answer saving. A complete submission should extend evaluation to account isolation, file validation, invalid credentials, malformed inputs, and provider failures once those modules are implemented.

## Expected future enhancements

Add provider abstraction and structured model output, multiple questions per session, an evidence-based four-category rubric, resume skills review, charts based on saved results, report export, migration management, rate limiting, and comprehensive frontend/backend tests.
