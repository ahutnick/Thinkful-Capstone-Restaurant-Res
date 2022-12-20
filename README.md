# Hutnick Thinkful Capstone - Periodic Tables: Restaurant Reservation System

## [Periodic Tables](https://cap-restaurant-res-client.herokuapp.com/)

## Screenshots
Dashboard
![Dashboard] (/readme_images/readme_dashboard.png)

New Reservation
![New_Reservation] (/readme_images/readme_new_res.png)

Edit Reservation
![Edit_Reservation] (/readme_images/readme_edit_reservation.png)

Seat Reservation
![Seat] (/readme_images/readme_seat.png)

New Table
![New_Table] (/readme_images/readme_new_table.png)

Search
![Search] (/readme_images/readme_search.png)

## Summary
This repository contains the server and client files for the Restaurant Reservation System titled Periodic Tables. This system allows restaurants to store tables with a given name and capacity, store reservations with a given date, time, first and last name, and party size, and seat the reservation at a table on a given date. 

Through the Dashboard home page, the restaurant will be able to see all reservations on a given date and table availability. They can cancel, seat, or finish a reservation through this page as well. This system also provides the user with the ability to search for previous, current, future, and cancelled reservations by phone number.

## Database 
This system uses PostgreSQL to store information on tables and reservations.
### Tables
This table stores existing tables using the following non-nullable fields:
- table_id - incremental integer - table identification number
- table_name - string - name of table
- capacity - integer - maximum number of people who can sit at this table

#### Reservations
This table stores existing reservations using the following non-nullable fields:
- reservation_id - incremental integer - reservation identification number
- first_name - string - first name of reservation holder
- last_name - string - last name of reservation holder
- mobile_number - string - mobile number of reservation holder
- reservation_date - date - date of reservation
- reservation_time - time - time of reservation
- people - integer - number of people in the reservation
- status - string - lists the customer as 'booked', 'seated', 'finished', or 'cancelled'

#### Res_Tables
This table allows for a many to many relationship between reservations and the tables at which they are seated. This setup allows users to keep records of where previous customers have sat and allows the restaurant to keep track of which tables are available on a given date. They have the following fields:
- res_table_id - incremental integer - reservation_table identification number
- reservation_id - id - the identification number for the reservation being seated
- table_id - id - the identification number for the table where the reservation is being seated
- available - boolean - indicates whether the listed table is currently free or occupied

## API
### "/reservations" Routes
#### "/"
##### GET list
List all reservations that match the given parameters. If a mobile number or part of a mobile number is provided in the data sent, then all reservations with a matching number will be returned. Otherwise, if a date is provided in the data sent, all reservations on that date will be returned.

##### POST create
Creates a new reservation using the provided data.

Validations:
- Properties provided must match the reservation fields (see "Reservations" in the above section)
- All of the above reservation properties (except "status") must be included
- Each property must conform to their corresponding data type
- People must be a positive nonzero integer
- Reservations cannot be made on Tuesdays when the restaurant is closed
- Reservations must be made between 9:30 a.m. and 9:30 p.m.
- Reservations cannot be made in the past (date and/or time)
- Reservation status must be "booked" upon creation 

#### "/:reservation_id"

##### GET read
Returns the reservation with the corresponding id.

Validations:
- The reservation exists

##### PUT update
Updates the existing reservation using the provided data.

Validations:
- Properties provided must match the reservation fields (see "Reservations" in the above section)
- All of the above reservation properties (except "status", "reservation_id", "created_at", "updated_at") must be included
- Each property must conform to their corresponding data type
- People must be a positive nonzero integer
- Reservations cannot be made on Tuesdays when the restaurant is closed
- Reservations must be made between 9:30 a.m. and 9:30 p.m.
- Reservations cannot be made in the past (date and/or time)
- Reservation status must be "booked"

#### "/:reservation_id/status"

##### PUT update status
Updates the status of the reservation with the corresponding identification number

Validations:
- The reservation exists
- The provided status is either "booked", "seated", "finished", or "cancelled"

### "/tables" Routes
#### "/"
##### GET list
List all tables and determine availability of each using the reservation_date provided in the query portion of the request.

##### POST create
Create new table using the data provided.

Validations:
- Properties provided must match the tables fields (see 'Tables' in the above Database section)
- All of the above tables properties must be provided
- Table name must be at least 2 characters
- Capacity must be a positive nonzero integer

#### "/:table_id"
##### GET read
Returns the table with the corresponding id.

Validations:
- The table exists
#### "/:table_id/seat"
##### PUT seat
Seats the specified reservation at the provided table, creating an entry in the res_tables table and setting the availability of that table to "false" for that date.

Validations:
- The table exists
- The reservation exists
- The number of people in the reservation does not exceed the capacity of the table
- The reservation is not already seated
- The reservation is not already finished
- The table is not already occupied

##### DELETE make available
Sets the "available" property of the res_tables entry to "true" and the "status" property of the reservation to "finished", effectively clearing the table for a new reservation.

Validations:
- The table exists
- The reservation exists
- The reservation is not already finished
- The table is not already free

## Technology Used
### Front-end
- React.js
- Bootstrap 4.5
### Back-end
- Node.js
- Express
### Database
- PostgreSQL

## Installation
Download the repository and run `npm i` in the command line. Then, run `npm start` to run both the server and the client.
