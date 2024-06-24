INSERT INTO users (username, password, email, first_name, last_name, is_admin)
VALUES ('testUser',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3RVc2VyIiwiaWF0IjoxNzE5MjQ0NzkwfQ.SPPgl1UWWQOjGRKqclLZcUtu8Cd3f8lksHAwEhZxIk8',
        'testUser@gmail.com',
        'Test',
        'User',
        FALSE),
       ('testadmin',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'testadmin@gmail.com',
        'Test',
        'Admin',
        TRUE);
