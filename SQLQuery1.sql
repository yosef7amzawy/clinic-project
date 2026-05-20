CREATE DATABASE ClinicDB;
GO
CREATE TABLE Patients (
    id INT PRIMARY KEY IDENTITY(1,1),
    full_name NVARCHAR(100) NOT NULL,
    phone NVARCHAR(20) NOT NULL,
    gender NVARCHAR(10),
    birth_date DATE,
    address NVARCHAR(200),
    created_at DATETIME DEFAULT GETDATE()
);
CREATE TABLE Users (
    id INT PRIMARY KEY IDENTITY(1,1),
    name NVARCHAR(100) NOT NULL,
    email NVARCHAR(100) UNIQUE NOT NULL,
    password NVARCHAR(255) NOT NULL,
    role NVARCHAR(20) CHECK (role IN ('doctor', 'receptionist')) NOT NULL
);
CREATE TABLE Appointments (
    id INT PRIMARY KEY IDENTITY(1,1),
    patient_id INT NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    status NVARCHAR(20) CHECK (status IN ('booked', 'cancelled', 'completed')) DEFAULT 'booked',
    payment_status NVARCHAR(20) CHECK (payment_status IN ('paid', 'unpaid')) DEFAULT 'unpaid',
    notes NVARCHAR(255),
    created_at DATETIME DEFAULT GETDATE(),

    CONSTRAINT FK_Patient
    FOREIGN KEY (patient_id) REFERENCES Patients(id)
);
ALTER TABLE Appointments
ADD CONSTRAINT UQ_Appointment UNIQUE (date, time);

INSERT INTO Patients (full_name, phone)
VALUES ('محمد حسن', '01001234567');

INSERT INTO Appointments (patient_id, date, time)
VALUES (1, '2026-04-20', '10:00');


SELECT name
FROM sys.check_constraints
WHERE parent_object_id = OBJECT_ID('Appointments');

ALTER TABLE Appointments
DROP CONSTRAINT CK__Appointme__statu__5165187F;
ALTER TABLE Appointments
ADD CONSTRAINT CK_Appointments_Status
CHECK (
    status IN (
        'تم الدفع',
        'سيتم الدفع عند الحضور'
    )
);





UPDATE Appointments
SET status = 'سيتم الدفع عند الحضور'
WHERE status NOT IN (
    'تم الدفع',
    'سيتم الدفع عند الحضور'
);

ALTER TABLE Appointments
ALTER COLUMN status NVARCHAR(100);


UPDATE Appointments
SET status = 'سيتم الدفع عند الحضور'44
WHERE status NOT IN (
    'تم الدفع',
    'سيتم الدفع عند الحضور'
);


ALTER TABLE Appointments
ADD CONSTRAINT CK_Appointments_Status
CHECK (
    status IN (
        'تم الدفع',
        'سيتم الدفع عند الحضور'
    )
);

DELETE FROM Appointments;
DBCC CHECKIDENT ('Appointments', RESEED, 0);

CREATE TABLE PatientHistory (

    id INT PRIMARY KEY IDENTITY(1,1),

    patient_name NVARCHAR(100),

    diagnosis NVARCHAR(500),

    medicines NVARCHAR(500),

    notes NVARCHAR(500),

    visit_date DATETIME DEFAULT GETDATE()

);



EXEC sp_rename 'PatientHistory', 'PatientHistories';
ALTER TABLE PatientHistories
ALTER COLUMN visit_date DATETIME2;

ALTER TABLE PatientHistories
DROP CONSTRAINT DF__PatientHi__visit__5BE2A6F2;

SELECT name
FROM sys.default_constraints
WHERE parent_object_id = OBJECT_ID('PatientHistories');


ALTER TABLE PatientHistories
DROP CONSTRAINT DF__PatientHi__visit__5EBF139D;
ALTER TABLE Appointments
ADD IsFinished BIT DEFAULT 0;

ALTER TABLE PatientHistories
ADD patient_id INT;



UPDATE Appointments
SET status = ''
WHERE status IS NULL;

UPDATE Appointments
SET time = '00:00:00'
WHERE time IS NULL;

UPDATE Appointments
SET date = GETDATE()
WHERE date IS NULL;

UPDATE Appointments
SET IsFinished = 0
WHERE IsFinished IS NULL;

ALTER TABLE Appointments
ADD is_finished BIT DEFAULT 0;

UPDATE Appointments
SET is_finished = 0
WHERE is_finished IS NULL;

-- شوف الجداول اللي عندك
SELECT * FROM PatientHistories;

UPDATE PatientHistories
SET patient_id = 1
WHERE patient_id IS NULL;

DELETE FROM PatientHistories
WHERE patient_id IS NULL;

SELECT Id, IsFinished
FROM Appointments

SELECT *
FROM PatientHistories



UPDATE Appointments
SET IsFinished = 1
WHERE Id = 1




