# Web Development Project 7 - *rpg-guild-assembly*

Submitted by: **Hamza Munis**

This web app: **is a fantasy guild management web application built with React and Supabase that allows users to create, track, and manage a roster of adventurers with class-based restrictions, elemental affinities, and signature abilities. The app features an immersive dark fantasy UI with interactive forms, real-time crew analytics, and a dynamic success scoring system that visually transforms the guild hall based on team composition and performance metrics. Users can recruit heroes, edit their profiles, view detailed character sheets, and monitor guild statistics including combat power, quest completion, and class/element distribution percentages.**

Time spent: **11** hours spent in total

## Required Features

The following **required** functionality is completed:


- [x] **The web app contains a page that features a create form to add a new crewmate**
  - Users can name the crewmate
  - Users can set the crewmate’s attributes by clicking on one of several values
- [x] **The web app includes a summary page of all the user’s added crewmatese**
  -  The web app contains a summary page dedicated to displaying all the crewmates the user has made so far
  -  The summary page is sorted by creation date such that the most recently created crewmates appear at the top
- [x] **A previously created crewmate can be updated from the list of crewmates in the summary page**
  - Each crewmate has an edit button that will take users to an update form for the relevant crewmate
  - Users can see the current attributes of their crewmate on the update form
  - After editing the crewmate's attribute values using the form, the user can immediately see those changes reflected in the update form and on the summary page 
- [x] **A previously created crewmate can be deleted from the crewmate list**
  - Using the edit form detailed in the previous _crewmates can be updated_ feature, there is a button that allows users to delete that crewmate
  - After deleting a crewmate, the crewmate should no longer be visible in the summary page
  - [x] **Each crewmate has a direct, unique URL link to an info page about them**
    - Clicking on a crewmate in the summary page navigates to a detail page for that crewmate
    - The detail page contains extra information about the crewmate not included in the summary page
    - Users can navigate to to the edit form from the detail page

The following **optional** features are implemented:

- [x] A crewmate can be given a category upon creation which restricts their attribute value options
  - e.g., a Dungeons and Dragons class or a development team role (project manager, product owner, etc.)
  - User can choose a `category` option to describe their crewmate before any attributes are specified
  - Based on the category value, users are allowed to access only a subset of the possible attributes
- [x] A section of the summary page, displays summary statistics about a user’s crew on their crew page
  - e.g., the percent of members with a certain attribute 
- [x] The summary page displays a custom “success” metric about a user’s crew which changes the look of the crewmate list
  - e.g., a pirate crew’s predicted success at commandeering a new galley


The following **additional** features are implemented:

* [x] N/A

## Video Walkthrough

Here's a walkthrough of implemented user stories:

<img src='' title='Video Walkthrough' width='' alt='Video Walkthrough' />

GIF created with Kap (MacOS)  

### Production Images

<img src='' title='' width='' alt='' />

## Notes

1. **Managing Asynchronous Data & Supabase Queries:** Fetching, updating, and deleting hero data directly through Supabase required careful error handling and conditional loading states. I had to ensure the app gracefully handled slow network requests or missing database records without crashing.

2. **Routing Dynamic Parameters & State Sync:** Passing specific hero IDs through React Router paths for viewing and editing created tricky navigation flows. I had to ensure that updating or deleting a hero automatically synced the database state and safely redirected users back to the roster.

3. **Calculating Derived Stats on the Frontend:** Computing combined team metrics—like total squad Combat Power, dominant element traits, and the distribution of elements and class over the guild roster required custom calculation logic over array data. I needed these stats to recalculate dynamically whenever heroes were added, modified, or banished.

4. **Guild success power:** A big challenge was calculating the guild success score and describing the criterion for the milesoines, like the newbie, growing, and legend milestone over every 20 score mark.

5. **State Management & Form Complexity:** Managing complex nested form state with interdependent fields (class restrictions affecting elements and abilities) required careful handling of useEffect dependencies and state updates. Ensuring that changing one field (like class) properly filtered available options in other fields without causing infinite render loops or losing user selections was particularly challenging.

6. **Dynamic UI Rendering & Visual Feedback:** Creating a visually immersive dark fantasy theme with particle effects, animated glows, gradient borders, and real-time character previews required extensive CSS customization while maintaining performance. Building responsive button-based selection interfaces that clearly communicate restrictions, show visual hierarchy, and provide smooth transitions for all interactive elements across multiple pages was complex and in the end some effects were undermined by the others while some are still comparatively hard to identify.

7. **Data Modeling & Database Integration:** Structuring the Supabase database to handle array-based fields (multiple elements per hero), nullable fields, and default values while maintaining backward compatibility for existing records required careful schema planning. Ensuring proper data validation, error handling, and seamless CRUD operations between the React frontend and Supabase backend with real-time updates was essential for a reliable user experience. this was especially hard because while the table looks simple enough, in the code it was kind of difficult to sync and implement the multiple choice. I stored array-based fields (like "elements") as comma-separated strings and handled through client-side parsing/stringifying for flexible schema management without migrations.

## License

    Copyright [2026] [Hamza Munis]

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.