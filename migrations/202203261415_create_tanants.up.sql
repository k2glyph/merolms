create table if not exists tenants (
     id           serial primary key,
     name         varchar(60) not null,
     subdomain       varchar(40) not null,
     cname varchar(100) null,
     invitation varchar(100) null,
     welcome_message text null,
     status INT NOT NULL,
     is_private BOOLEAN NOT NULL,
     custom_css TEXT NOT NULL,
     logo_bkey varchar(512) NOT NULL,
     locale VARCHAR(10) NOT NULL,
     is_email_auth_allowed BOOLEAN NOT NULL,

     created_at   timestamptz not null default now()
);
CREATE UNIQUE INDEX tenant_cname_unique_idx ON tenants (cname);
CREATE UNIQUE INDEX tenant_subdomain_unique_idx ON tenants (subdomain);
update tenants set invitation = '', welcome_message = '';
UPDATE tenants SET is_private = false;
UPDATE tenants SET custom_css = '';
UPDATE tenants SET locale = 'en';
UPDATE tenants SET is_email_auth_allowed = TRUE;
