create table if not exists users (
     id           serial primary key,
     name         varchar(100) null,
     email        varchar(200) not null,
     created_at   timestamptz not null default now(),
	 role INT NOT NULL,
	 status INT NOT NULL,
	 api_key VARCHAR(32) NULL,
	 api_key_date TIMESTAMPTZ NULL,
	 avatar_type smallint null,
	 avatar_bkey varchar(512) null,
	 email_supressed_at TIMESTAMPTZ NULL
);
ALTER TABLE users ADD tenant_id INT;
CREATE UNIQUE INDEX user_email_unique_idx ON users (tenant_id, email) WHERE email != '';
CREATE UNIQUE INDEX user_id_tenant_id_key ON users (tenant_id, id);
CREATE UNIQUE INDEX users_api_key ON users (tenant_id, api_key);