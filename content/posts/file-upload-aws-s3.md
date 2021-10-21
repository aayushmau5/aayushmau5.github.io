---
title: "Uploading files to AWS S3 using NodeJS"
description: "How to upload files to AWS S3 with certain features like limiting file size, streaming files, etc."
date: 2021-10-03T16:19:39+05:30
draft: true
showToc: true
---

### Introduction

So, I was working on a project that requires user to upload a desired file which would be stored in AWS S3. I have made this blog in order to have a "note" about the process of uploading files.

### What this blog will cover?

This blog will cover how one can upload files to AWS S3. The files being uploaded will not be chuncked, we are sending the file as a whole, thus the files we are sending will be somewhat small, which brings us to limiting file size which we'll see in this blog.

Other than that, we will go over file streaming, a way to directly streaming the files contents to S3 without storing it in memory first. Pretty exciting stuff!!

### Prerequisites

I'm assuming you know how to setup a server & have basic routes and stuff. This blog will use ExpressJS as the server framework, but feel free to use the framework of your choice.

### What are we making?

This blog will cover:

- Having a frontend which will send files(to our backend) as well as fetch the files(from the backend).
- Having an API for file uploading which is basically upload our files to AWS S3.

#### Why make an API?

There are two ways(that I know of) to upload your files to S3:

1. Use S3 pre-signed URL to upload your files directly to S3.
   - This blog will not cover this apporach. You can learn about that [here](https://docs.aws.amazon.com/AmazonS3/latest/userguide/PresignedUrlUploadObject.html).
1. Have an API, to which, you will send your files to be uploaded to S3.

So, why do we NEED an API?

To do **some stuff** in between. Let me explain.

- What if we want to send the file we are receiving to a third-party application for processing?
- What if we want to check this file for any malicious stuff before uploading it to S3?

Having an API in-between gives us a flexibilty to do something with the file before we upload it to S3.

With that out of the way, lets start with looking at the workflow of how everything will work.

### Workflow

Here's the how the whole workflow will look like.

![Diagram showing the flow of uploading files. Making request from client, through API and into S3, and getting the response back](/file-upload-aws-s3/flow.png#center)

There are 3 main components in this flow:

- Client(Frontend)
- API(Backend)
- AWS S3

Our frontend client will make a POST request to our backend with the files, our backend API will take those files, do some processing, and then upload them to S3. After successfully uploading the files to S3, our API will return the response we get from S3 to our frontend client.

Pretty straightforward?

Alright, lets get started!

### API & S3

We will start with making the API first.

The functionality of this API will be:

- Uploading the gives files to S3.
- Updating a file using new data.
- Deleting a file.
- Fetching files.

Just basic CRUD(Create, Read, Update, Delete) operations.

#### Setup

We will start with a basic express setup.

> NOTE: This exmaple will have the bare minimum to make the file uploader work.

```js
// index.js
const app = require("express")();
const PORT = process.env.PORT || 8000;

const controllers = require("./controllers");

// routes
app.get("/:id", controllers.getFile);
app.post("/", controllers.uploadFile);
app.patch("/:id", controllers.updateFile);
app.delete("/:id", controllers.deleteFile);

app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));
```

Right now, the controllers are just basic empty functions.

```js
// controllers.js
exports.getFile = async (req, res, next) => {};
exports.uploadFile = async (req, res, next) => {};
exports.updateFile = async (req, res, next) => {};
exports.deleteFile = async (req, res, next) => {};
```

we will fill in the gaps later.

#### Handling Requests

A little background. When you make a POST request, you have to encode the request body in some way. The most common encoding type `multipart/form-data` is used send files from Client to our Backend. We will see how to send files to our backend when we make the frontend UI.

We will use [`multer`](https://www.npmjs.com/package/multer), which is a middleware that is used to process the `multipart/form-data` encoded data.

The form data, encoded using `multipart/form-data`, consists of simple key, value pairs. These values can be simple text data or file.

What Multer does is it processes the given data, and then fills the request object with certain fields like `files` which contains all the files we have send from the client, and `body` which contains all the text key value pairs we have sent from the client.

![Using Multer as middleware](/file-upload-aws-s3/Multer-Middleware.png)

Taking the example of our existing controllers, the request object is `req` and we can access the files using `req.files` and access the key, value pairs using `req.body`.

That's enough concept for now. Let's setup our Multer middleware and see it in action:

> First, install Multer Using `npm i multer`

And now use `multer` as a middleware.

```js
// index.js
// newly added or modified lines are marked by <-
const app = require("express")();

const multer = require("multer"); // <-
const upload = multer(); // <-

const PORT = process.env.PORT || 8000;

const controllers = require("./controllers");

// routes
app.get("/:id", controllers.getFile);
app.post("/", upload.array("files"), controllers.uploadFile); // <-
app.patch("/:id", upload.single("file"), controllers.updateFile); // <-
app.delete("/:id", controllers.deleteFile);

app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));
```

We just imported multer, invoked it, which gave us a middleware which we stored in `upload` variable.

#### What's `upload.array` and `upload.single`?

Multer has the ability to process one or more than one files. In case you need to process a single file, you can use `upload.single`, and where you need to process multiple files, use `upload.array`.

In order to process the files, you need to invoke this function passing in the **name of the field**(the key in our form data) in which the files are being sent from the client. This causes multer to process the files from given name of the field.

So, what `upload.array("files")` does it looks for a field named `files` and process it looking for a bunch of files.

Then, it **populates** our request body with a field named `files` which contains all the processed files.

Lets just `console.log` to see it in action. Enter the following code in our POST controller.

```js
// controllers.js
exports.getFile = async (req, res, next) => {};

exports.uploadFile = async (req, res, next) => {
  console.log(req.body);
  console.log(req.files);
};

exports.updateFile = async (req, res, next) => {};

exports.deleteFile = async (req, res, next) => {};
```

### Frontend

> First give a brief intro about what would be added here.
> framework agnostic.

### Organization

- Basic intro
- What this blog post will cover
- Prerequisites
- The architechture of the file uploader
- S3 specific things
  - Setting up S3 and getting the credentials
  - Using AWS sdk for file specific CRUD operations
- Some basic concepts(and indepth diagrams).
- Approaches (Only intro)
  - Multer
  - Busboy
  - Pros and cons
- Basic setup
- Working with multer
- Working with busboy
- Conclusion
- Work on frontend
  - Basic input elements and JS.
