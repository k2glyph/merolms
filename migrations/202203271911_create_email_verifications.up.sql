create table if not exists email_verifications (
     id             serial primary key,
     name VARCHAR(200) NULL DEFAULT NULL,
     tenant_id      int not null,
     email          varchar(200) not null,
     created_at     timestamptz not null,
     key            varchar(64) not null,
     verified_at    timestamptz null,
     expires_at    timestamptz null,
     kind smallint NOT NULL,
     foreign key (tenant_id) references tenants(id)
);

ALTER TABLE email_verifications ADD user_id INT NULL REFERENCES users (id);
ALTER TABLE email_verifications
    DROP CONSTRAINT email_verifications_user_id_fkey RESTRICT;
    
ALTER TABLE email_verifications
   ADD CONSTRAINT email_verifications_user_id_fkey
   FOREIGN KEY (user_id, tenant_id) 
   REFERENCES users(id, tenant_id);

CREATE UNIQUE INDEX email_verification_key_idx ON email_verifications (tenant_id, key);

