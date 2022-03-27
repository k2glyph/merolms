create table if not exists user_providers (
     user_id      int not null,
     provider     varchar(40) not null,
     provider_uid varchar(100) not null,
     created_at   timestamptz not null default now(),
     tenant_id INT NOT NULL,
     primary key (user_id, provider),
     foreign key (user_id) references users(id)
);

CREATE UNIQUE INDEX user_provider_unique_idx ON user_providers (user_id, provider);



UPDATE user_providers SET tenant_id = (SELECT tenant_id FROM users WHERE users.id = user_providers.user_id);

ALTER TABLE user_providers
   ADD CONSTRAINT user_providers_tenant_id_fkey
   FOREIGN KEY (tenant_id) 
   REFERENCES tenants(id);

ALTER TABLE user_providers
    DROP CONSTRAINT user_providers_user_id_fkey RESTRICT;
    
ALTER TABLE user_providers
   ADD CONSTRAINT user_providers_user_id_fkey
   FOREIGN KEY (user_id, tenant_id) 
   REFERENCES users(id, tenant_id);
