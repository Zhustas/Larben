CREATE TABLE Users (
    ID           INTEGER PRIMARY KEY AUTOINCREMENT,
    NAME         TEXT    NOT NULL,
    LAST_NAME    TEXT    NOT NULL,
    BIRTH_DATE   DATE,
    USERNAME     TEXT    NOT NULL UNIQUE,
    EMAIL        TEXT    NOT NULL UNIQUE,
    PASSWORD     TEXT    NOT NULL,
    DESCRIPTION  TEXT,
    GUILD_ID     INTEGER
);

CREATE TABLE SessionTokens (
    ID            INTEGER  PRIMARY KEY AUTOINCREMENT,
    USER_ID       INTEGER  NOT NULL,
    TOKEN         TEXT     NOT NULL,
    TOKEN_CREATED DATETIME NOT NULL,
    FOREIGN KEY (USER_ID) REFERENCES Users(ID) ON DELETE CASCADE
);

-- Kol kas "Posts" tegu turi galimybę tik įrašyti tekstą (o ne pridėti paveikslėlio pvz)
CREATE TABLE Posts (
    ID            INTEGER  PRIMARY KEY AUTOINCREMENT,
    USER_ID       INTEGER  NOT NULL,
    TEXT          TEXT     NOT NULL,
    POST_DATETIME DATETIME NOT NULL,
    LIKES         INTEGER  NOT NULL,
    FOREIGN KEY (USER_ID) REFERENCES Users(ID) ON DELETE CASCADE
);

CREATE TABLE Markers (
    ID          INTEGER PRIMARY KEY AUTOINCREMENT,
    USER_ID     INTEGER NOT NULL,
    DESCRIPTION TEXT    NOT NULL,
    LATITUDE    REAL    NOT NULL,
    LONGITUDE   REAL    NOT NULL,
    FOREIGN KEY (USER_ID) REFERENCES Users(ID) ON DELETE CASCADE
);

DROP TABLE Users;
DROP TABLE SessionTokens;
DROP TABLE Posts;
DROP TABLE Markers;
