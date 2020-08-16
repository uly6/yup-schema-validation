const yup = require("yup");

const schema = yup.object().shape({
  name: yup.string().required().max(10).label("Name"),
  age: yup.number().integer().moreThan(0).label("Age"),
  email: yup.string().email().label("E-mail"),
  hasWebsite: yup.boolean().required().label("Do you have a website?"),
  website: yup.string().when("hasWebsite", {
    is: (value) => value === true,
    then: yup.string().url().required().label("Website"),
    otherwise: yup.string().transform((x) => undefined), // remove website field
  }),
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
    hasWebsite: false,
    website: "http://www.test.com",
    when: "10/01/2010",
  })
  .then((valid) => {
    console.log("valid:", valid);
  })
  .catch((err) => {
    console.log("errors:", err.errors);
  });

// note: there is no website in the valid value
// valid: {
//   when: 2010-09-30T11:00:00.000Z,
//   hasWebsite: false,
//   email: 'test@test.com',
//   age: 15,
//   name: 'Subaru'
// }

// date default
schema
  .validate({
    name: "Subaru",
    age: 15,
    email: "test@test.com",
    hasWebsite: true,
    website: "http://www.test.com",
  })
  .then((valid) => {
    console.log("valid:", valid);
  })
  .catch((err) => {
    console.log("errors:", err.errors);
  });

// valid: {
//   when: 2020-08-16T23:38:21.104Z,
//   hasWebsite: true,
//   website: 'http://www.test.com',
//   email: 'test@test.com',
//   age: 15,
//   name: 'Subaru'
// }

// errors
schema
  .validate(
    {
      name: "Subaru Natsuki",
      age: 0,
      email: "test.com",
      hasWebsite: true,
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

// errors: [
//   { path: "name", errors: ["Name must be at most 10 characters"] },
//   { path: "age", errors: ["Age must be greater than 0"] },
//   { path: "email", errors: ["E-mail must be a valid email"] },
//   { path: "website", errors: ["Website is a required field"] },
// ];
