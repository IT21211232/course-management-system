[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/MhkFIDKy)

## Project setup instructions

1. Install Node.js and npm.
2. Clone the project repository.
3. Navigate to the project directory.
4. Use `npm init` to setuip a new npm package
5. Install dependencies using `npm install`.
6. Configure environment variables by creating a `.env` file.
7. Start the server using `npm run dev`.

## API end point documentation

# login-register

1. login admin - http://localhost:8070/signin/login

{
"username": "it21211232",
"password": "Tester432"
}

2. register - http://localhost:8070/signup/add

{
"username":"it21211232",
"password": "Tester432",
"name":"Student01",
"role":"student"
}

3. login student - http://localhost:8070/signin/login

{
"username": "it21211232",
"password": "Tester432"
}

4. login faculty - http://localhost:8070/signin/login

{
"username": "FOC",
"password": "Tester432"
}

# Courses

1. add course - http://localhost:8070/course/add

{
"crscode": "SE3070",
"crsname": "Software Quality Management",
"description": "Description 07",
"credit": 10
}

2. get courses - http://localhost:8070/course/

3. delete course - http://localhost:8070/course/delete/SE3040

4. add course with faculty - http://localhost:8070/course/add

{
"crscode": "SE3062",
"crsname": "Module 01",
"description": "Here the faculty is also passed",
"credit": 3,
"faculty": "FOC"
}

5. update course - http://localhost:8070/course/update/SE3040

{
"crsname": "Application Frameworks changed",
"description": "Description 01",
"credit": 4
}

6. update course faculty - http://localhost:8070/course/update/faculty/SE3040

{
"faculty": "FOC"
}

## Course enrolment

1. enroll in course - http://localhost:8070/enroll/enroll

{
"crscode":"SE3050"
}

2. Student unenroll student - http://localhost:8070/enroll/unenroll

{
"crscode":"SE3050"
}

3. admin unenroll student - http://localhost:8070/enroll/unenrollstudent

{
"username":"it21211232",
"coursecode": "SE5040"
}

4. get enrollments - http://localhost:8070/enroll/

# timetable

1. add class to timetable - http://localhost:8070/class/add

{
"date": "monday",
"location": "A507",
"course": "SE3050",
"startTime": "2024-03-25T08:00:00.000+00:00",
"endTime": "2024-03-25T09:00:00.000+00:00"
}

2. update class - http://localhost:8070/class/update/65fcf1955cfe3ef9cf801129

{
"date": "tuesday",
"location": "A507",
"course": "SE3050",
"startTime": "2024-03-25T08:00:00.000+00:00",
"endTime": "2024-03-25T09:00:00.000+00:00"
}

3. get timetables - http://localhost:8070/class/

The fetching of data happens based on the role of the user, and is determined by the sign in type (role - admin, student, faculty).

4. delete class from timetable - http://localhost:8070/class/delete/65fcf1955cfe3ef9cf801129

# Notifications

1. get notifications - http://localhost:8070/notifications

# Resources

1. Add resources - http://localhost:8070/resource/add

{
"name": "Red pointer laser 10W",
"description": "Able to point at things at a distance of 30 rows."
}

## Running unit tests

1. Navigate to the backend folder using the command `cd backend`.
2. Use the command `npx jest` to run the unit tests.
