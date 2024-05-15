\echo 'Delete and recreate parks db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE parks;
CREATE DATABASE parks;
\connect parks

\i parks-schema.sql
\i parks-seed.sql

\echo 'Delete and recreate parks_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE parks_test;
CREATE DATABASE parks_test;
\connect parks_test

\i parks-schema.sql