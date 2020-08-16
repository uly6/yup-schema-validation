const yup = require("yup");

const schema = yup.object().shape({
  name: yup.string().required().max(10).label("Name"),
  age: yup.number().integer().moreThan(0).label("Age"),
  email: yup.string().email().label("E-mail"),
  website: yup.string().url().label("Website"),
  // when: yup.date().default(Date.now), // not working
  when: yup
    .date()
    .default(() => new Date())
    .label("When"),
});

// all valid
schema
  .validate({
    name: "Subaru",
    age: 15,
    email: "test@test.com",
    website: "http://www.test.com",
    when: "10/01/2010",
  })
  .then((valid) => {
    console.log("valid:", valid);
  })
  .catch((err) => {
    console.log(
      "errors:",
      err.inner.map(({ path, errors }) => ({ path, errors }))
    );
  });

// date default
schema
  .validate({
    name: "Subaru",
    age: 15,
    email: "test@test.com",
    website: "http://www.test.com",
  })
  .then((valid) => {
    console.log("valid:", valid);
  })
  .catch((err) => {
    console.log(
      "errors:",
      err.inner.map(({ path, errors }) => ({ path, errors }))
    );
  });

// errors
schema
  .validate(
    {
      name: "Subaru Natsuki",
      age: 0,
      email: "test.com",
      website: "test.com",
    },
    { abortEarly: false }
  )
  .then((valid) => {
    console.log("valid:", valid);
  })
  .catch((err) => {
    console.log(
      "errors:",
      err.inner.map(({ path, errors }) => ({ path, errors }))
    );
  });
