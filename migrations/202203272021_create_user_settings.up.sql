create table if not exists user_settings (
  id          serial primary key,
  user_id     int not null,
  key         varchar(100) not null,
  value       varchar(100) null,
  tenant_id INT NOT NULL,
  foreign key (user_id) references users(id)
);

create unique index user_settings_uq_key on user_settings (user_id, key);


ALTER TABLE user_settings
   ADD CONSTRAINT user_settings_tenant_id_fkey
   FOREIGN KEY (tenant_id) 
   REFERENCES tenants(id);

ALTER TABLE user_settings
    DROP CONSTRAINT user_settings_user_id_fkey RESTRICT;
    
ALTER TABLE user_settings
   ADD CONSTRAINT user_settings_user_id_fkey
   FOREIGN KEY (user_id, tenant_id) 
   REFERENCES users(id, tenant_id);

UPDATE user_settings SET key = 'event_notification_new_post' WHERE key = 'event_notification_new_idea';
