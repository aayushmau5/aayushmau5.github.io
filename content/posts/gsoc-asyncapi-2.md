---
title: "GSoC at AsyncAPI: Part 2"
date: "2021-07-03T21:13:49+05:30"
draft: false
description: "My GSoC experience blog"
tags: ["gsoc", "open-source", "asyncapi"]
showToc: true
cover:
  image: "/week-3/marek-piwnicki-cpNor3rFdWk-unsplash.jpg"
  alt: "Moon and forest"
  caption: "Photo by [Marek Piwnicki](https://unsplash.com/@marekpiwnicki) on [Unsplash](https://unsplash.com/)"
  relative: false
  hidden: false
---

If you want to read about what happened during Week 1 and 2, there's a post about it [here](https://aayushmau5.github.io/posts/week-1-2-at-asyncapi).

It's the end of third week, and time to put down the things happened this week.

### Task

During this week I was tasked to get a **POC**(Proof of Concept) done for the project, which basically meant generating the diff(at least show that it can be done) and outputting the result. I was supposed to showcase this on Friday meeting with mentors. Though, that's not what exactly happened during the meeting. Something more exciting happened, **Read on**.

### Approach

**Note: There won't be any code here because what I'm gonna talk about has been not implemented right now. Read more to know the reason.**

My approach was to use the `parser` function which I implemented during the first week to pass two AsyncAPI documents. This function will return an object containing the parsed JSON data of the document.

Now this data can be passed into a **diffing** function which will generate the difference between the passed two JSON data.

The difference generated will be in an array which I will iterate over, and see what type of change has been made. For example, if something has been deleted, added, or modified etc.

Then we will have a `standard.json` data file which categorizes the properties as **breaking**/**non-breaking** changes. As our code goes through the diff array data, it will check the `standard.json` file and see that what type of change is it, then it will categorize the change based on that.

**For the time being, I'm not going to share any code because a lot of thinking + work has to be done still, and putting the code right here may mislead some folks.**

### Taking a step back

Came Friday, I showcased the POC to my mentors(Vinit Shahdeo and Anubhav Vats). Pretty early into the meeting, we came to a realization.

**Instead of focusing on the code, we first have for focus on the output of our library.**

What does that mean?

Vinit Shahdeo, my mentor, made me realize the importance of having an **extensible** & **future-proof** output.

There are a lot of use case for this AsyncAPI `diff` library. For example, you can use it in a CLI, show diff visually like GitHub does, generate change logs based on the diff, and a lot more.

In order to support those use cases, we must have a suitable output format which must fit all. So, instead of worrying about choosing the suitable diffing library, and writing the code, we **take a step back** and start thinking about the output.

If we come up with a suitable output, it will be easier for us to choose suitable tools to help with our code.

Therefore, the diffing code has now been put on hold until we come up with the output format(the reason why I didn't want to share any code at this point).

### Learning experience

The most important thing I learned this week was that why should we think about **scalability**, keeping in mind the use cases of the product we make.

### Other stuff

Other stuff that happened during this week:

- Work finally done on [this issue](https://github.com/asyncapi/website/issues/86) which was planned for the `2.1.0` release of AsyncAPI spec. It was a lot of fun to work with GitHub Actions, and breaking + fixing the [website](https://www.asyncapi.com). I'm now looking forward to working on some more issues in the AsyncAPI ecosystem ;).
- AsyncAPI `2.1.0` is now released. Check the release notes [here](https://www.asyncapi.com/blog/release-notes-2.1.0).

Aaaand, that concludes my third week at AsyncAPI. Much excited for the next week. Cya!
