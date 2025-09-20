-- Insert sample data into the account table
INSERT INTO account (account_firstname, account_lastname, account_email, account_password)
VALUES('Tony', 'Stark', 'tony@starknet.com', 'Iam1ronM@n');

-- Updating the account type for the sample data
UPDATE account
SET account_type = 'Admin'
WHERE account_email = 'tony@starknet.com';


-- Deleting Tony Stark
DELETE FROM account
WHERE account_email = 'tony@starknet.com';

-- Updating the description of an inventory item
-- Updating the GM interiors 
UPDATE inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model ='Hummer';

SELECT i.make, i.model, c.classification_name
FROM inventory i
INNER JOIN classification c
    ON i.classification_id = c.classification_id
WHERE c.classification_name = 'Sport';

-- Updating thumbnail
UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');
    