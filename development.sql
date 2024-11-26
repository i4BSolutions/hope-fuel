-- Drop and create the development database
DROP DATABASE IF EXISTS development;
CREATE DATABASE development;
USE development;

-- Create Currency table and insert demo data
CREATE TABLE Currency (
    CurrencyId INT AUTO_INCREMENT PRIMARY KEY,
    CurrencyCode VARCHAR(10)
);

INSERT INTO Currency (CurrencyCode) VALUES 
('USD'),
('EUR'),
('JPY');

-- Create Wallet table and insert demo data
CREATE TABLE Wallet (
    WalletId INT AUTO_INCREMENT PRIMARY KEY,
    CurrencyId INT,
    WalletName VARCHAR(255),
    FOREIGN KEY (CurrencyId) REFERENCES Currency(CurrencyId)
);

INSERT INTO Wallet (CurrencyId, WalletName) VALUES 
(1, 'Personal Wallet'),
(2, 'Business Wallet'),
(3, 'Savings Wallet');

-- Create SupportRegion table and insert demo data
CREATE TABLE SupportRegion (
    SupportRegionID INT AUTO_INCREMENT PRIMARY KEY,
    Region VARCHAR(255)
);

INSERT INTO SupportRegion (Region) VALUES 
('North America'),
('Europe'),
('Asia');

-- Create UserRole table and insert demo data
CREATE TABLE UserRole (
    UserRoleID INT AUTO_INCREMENT PRIMARY KEY,
    UserRole VARCHAR(255)
);

INSERT INTO UserRole (UserRole) VALUES 
('Support Agent'),
('Admin'),
('Payment Processor');

-- Create Agent table and insert demo data
CREATE TABLE Agent (
    AgentId INT AUTO_INCREMENT PRIMARY KEY,
    AwsId VARCHAR(255),
    UserRoleId INT,
    FOREIGN KEY (UserRoleId) REFERENCES UserRole(UserRoleID)
);

INSERT INTO Agent (AwsId, UserRoleId) VALUES 
('AWS123', 1),
('AWS124', 2),
('AWS125', 3);

-- Create Note table and insert demo data
CREATE TABLE Note (
    NoteID INT AUTO_INCREMENT PRIMARY KEY,
    Note VARCHAR(255),
    Date DATE,
    AgentID INT,
    FOREIGN KEY (AgentID) REFERENCES Agent(AgentId)
);

INSERT INTO Note (Note, Date, AgentID) VALUES 
('Customer requested refund', '2024-01-01', 1),
('Transaction approved', '2024-02-15', 2),
('Inquiry about service', '2024-03-05', 3);

-- Create Customer table and insert demo data
CREATE TABLE Customer (
    CustomerId INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(255),
    Email VARCHAR(255),
    ManyChatId VARCHAR(255),
    ExpireDate DATE,
    UserCountry VARCHAR(255),
    ContactLink VARCHAR(255),
    AgentId INT,
    CardID INT,
    FOREIGN KEY (AgentId) REFERENCES Agent(AgentId)
);

INSERT INTO Customer (Name, Email, ManyChatId, ExpireDate, UserCountry, ContactLink, AgentId, CardID) VALUES 
('John Doe', 'john@example.com', 'MANY123', '2025-01-01', 'USA', 'contact/johndoe', 1, 101),
('Jane Smith', 'jane@example.com', 'MANY124', '2024-12-31', 'UK', 'contact/janesmith', 2, 102),
('Bob Johnson', 'bob@example.com', 'MANY125', '2025-06-30', 'Japan', 'contact/bobjohnson', 3, 103);

-- Create Transactions table and insert demo data
CREATE TABLE Transactions (
    TransactionID INT AUTO_INCREMENT PRIMARY KEY,
    CustomerID INT,
    SupportRegionID INT,
    WalletID INT,
    Amount FLOAT,
    PaymentCheck BOOLEAN,
    PaymentCheckTime TIMESTAMP,
    NoteID INT,
    TransactionDate TIMESTAMP,
    PaymentDenied BOOLEAN,
    Month INT,
    HopeFuelID INT,
    FOREIGN KEY (CustomerID) REFERENCES Customer(CustomerId),
    FOREIGN KEY (SupportRegionID) REFERENCES SupportRegion(SupportRegionID),
    FOREIGN KEY (WalletID) REFERENCES Wallet(WalletId),
    FOREIGN KEY (NoteID) REFERENCES Note(NoteID)
);

INSERT INTO Transactions (CustomerID, SupportRegionID, WalletID, Amount, PaymentCheck, PaymentCheckTime, NoteID, TransactionDate, PaymentDenied, Month, HopeFuelID) VALUES 
(1, 1, 1, 100.00, TRUE, '2024-01-02 10:00:00', 1, '2024-01-02 09:55:00', FALSE, 1,1),
(2, 2, 2, 200.00, FALSE, NULL, 2, '2024-02-20 15:30:00', TRUE, 2,2),
(3, 3, 3, 300.00, TRUE, '2024-03-10 12:00:00', 3, '2024-03-10 11:50:00', FALSE, 3,3);

-- Create ScreenShot table and insert demo data
CREATE TABLE ScreenShot (
    ScreenShotID INT AUTO_INCREMENT PRIMARY KEY,
    TransactionID INT,
    ScreenShotLink VARCHAR(2048),
    FOREIGN KEY (TransactionID) REFERENCES Transactions(TransactionID)
);

INSERT INTO ScreenShot (TransactionID, ScreenShotLink) VALUES 
(1, 'https://example.com/screenshot1'),
(2, 'https://example.com/screenshot2'),
(3, 'https://example.com/screenshot3');

-- Create TransactionAgent table and insert demo data
CREATE TABLE TransactionAgent (
    TransactionAgentID INT AUTO_INCREMENT PRIMARY KEY,
    TransactionID INT,
    AgentID INT,
    LogDate TIMESTAMP,
    FOREIGN KEY (TransactionID) REFERENCES Transactions(TransactionID),
    FOREIGN KEY (AgentID) REFERENCES Agent(AgentId)
);

INSERT INTO TransactionAgent (TransactionID, AgentID, LogDate) VALUES 
(1, 1, '2024-01-02 10:05:00'),
(2, 2, '2024-02-20 15:35:00'),
(3, 3, '2024-03-10 12:05:00');

-- Create Table for PaymentTeam Form Status
CREATE TABLE TransactionStatus (
   TransactionStatusID INT AUTO_INCREMENT PRIMARY KEY,
   TransactionStatus VARCHAR(255) NOT NULL

);
-- Insert data into FormStatus table
INSERT INTO TransactionStatus (TransactionStatusID, TransactionStatus) VALUES 
(1, 'ဖောင်တင်သွင်းခြင်း'),
(2, 'စစ်ဆေးပြီး'),
(3, 'ပြီးစီး'),
(4,'ပယ်ဖျက်');


CREATE TABLE FormStatus (
    FormStatusID INT AUTO_INCREMENT PRIMARY KEY,
    TransactionID INT,
    TransactionStatusID INT,
    FOREIGN KEY (TransactionID) REFERENCES Transactions(TransactionID),
    FOREIGN KEY (TransactionStatusID) REFERENCES TransactionStatus(TransactionStatusID)

);



