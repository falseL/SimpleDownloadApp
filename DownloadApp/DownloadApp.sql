DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS Downloads;

Create table Users
(
     ID int IDENTITY(1,1) NOT NULL primary key,
     UserID nvarchar(50) NOT NULL,
     Password nvarchar(50) NOT NULL
)
GO

Create table Downloads
(
	ID int IDENTITY(1,1) NOT NULL primary key,
	FileName nchar(10) NOT NULL,
	FileType nchar(10) NOT NULL,
	FilePath nvarchar(max) NOT NULL,
	CreateTime time(7) NOT NULL
)
GO

Insert into Users values ('admin', 'adminPass')
Insert into Users values ('user', 'userPass')
GO

Insert into Downloads values ('demoPic', 'jpg', 'Public/demoPic.jpg', '13:30')
Insert into Downloads values ('demoVideo', 'mp4', 'Public/demoVideo.mp4', '15:30')
Insert into Downloads values ('demoPdf', 'pdf', 'Public/demoPdf.pdf', '17:30')
Insert into Downloads values ('demoWord', 'doc', 'Public/demoWord.doc', '19:30')
GO