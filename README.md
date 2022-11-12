# Rate Limiting
## What
A rate limiter for node promises written in Typescript.
## Why
I wanted to understand non-blocking rate limiting in Node. Brought about by 
wondering how I'd handle calls to a rate limited API from my application 
without a library or package. 
## What I'll Improve
- [ ] More test coverage. 
- [ ] Handle both promises and normal functions. 
- [ ] Make more use of event emitter to extend its API to be usable in more 
   environments.