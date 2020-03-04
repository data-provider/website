---
id: motivation
title: Motivation
---

## The problem

As a front-end developer and what some call an &quot;architect&quot; in very big projects, I spent lot of time of last years trying to achieve a fully modular system in which the teams could __reuse pieces across many applications__.

For simple components this is a relativelly easy job, but, when pieces are connected to data origins or to a global state _(what I usually call a &quot;module&quot;)_, then the thing changes, but why?...

In most cases, despite the fact of following recommended good practices and patterns very extended thanks to great tools and Frameworks like React, Redux, Reselect, etc. the pieces still were not 100% reusable. Some parts of its logic remained "coupled" to an upper level, which made almost impossible that ones could work without the others in a new and completely isolated environment.


## The causes

I realized that usually it was due to the fact that these pieces, without even realizing it, were delegating a part of their responsibilities to another one, normally at charge of making a preliminary initialization, recovering certain data and setting it into the "state" _(a very usual example of this is the case where the user data are retrieved during the login phase, then saved into the state, and then accessed afterwards by a lot of pieces which are presupposing that the data are always there, ready to be used)_

Most of times this is made simply because we want to optimize, save resources avoiding multiple calls to the server and unnecessary extra computations, but, following this pattern, we are making our pieces completely dependant, in a dark way. Those pieces can not be instantiated without the other ones, and problably requiring an specific load order. Which is worse, the first piece is probably preparing or formatting the data in an specific way to which the rest of pieces can be highly coupled without ever knowing about. This "dark" dependencies can easily propagate by the entire system without having notice, and, if you are not very careful, all the system becomes an indivisible and "monolithic" great piece of software. You could end working in an scenario in which hundred of invisible dependencies make almost impossible to remove or replace some pieces _(guess which ones)_ without tons of pain, that is the time when you can rename your project to "Domino blocks play".

## The solution

So, maybe the solution can be to make every single piece responsible of requesting always the data it needs _(connecting always them to the providers they want to read)_, and doing in the most granular way possible, requesting only the data they want, and in the format they expect _(using specific selectors)_.

This solution simply is at charge of providing cache and memoization in order to avoid unnecesary resources comsumption, and to abstract the pieces about the fact of from where are they reading the data. They don't need to know about the existance of an API, or an State, or localStorage, or whatever. They simply need the data, is the "data layer" which should be the one responsible of knowing about where the data is being retrieved or sended.

In this way, each piece has well defined dependencies, and you can move them from one project to another _(or from one part of your project to another)_ without problem. The data will be requested and processed only when necessary, and only once (until the data decides that one cache has to be cleaned, then all of the pieces connected to that data are informed about, so they can request it again).

## Concepts

As a summary, main targets of this project are:

- Force pieces to always request for the data they need, avoiding a negative performance impact.
- Make dependencies with the data clearly identifiable and traceable.
- Provide selectors allowing to combine data from different data origins or another selectors, keeping the same interface and principles.
- Inform pieces when the cache of a provider is invalidated, so impacted pieces can request the data again.
- Unify the interfaces of different data origins, in order to isolate the pieces about the knwoledge from where are the data being retrieved.
- Provide simple methods to handle loading and error states.

I hope that, __if this library does not result useful, at least these principles do, because this is the really important part of the project, more than the code itself.__ At the end, all patterns described here can be implemented using combinations of other tools. This project simply tries to facilitate the process.
