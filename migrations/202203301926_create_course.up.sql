create table if not exists categories (
    id serial primary key,
    name varchar(100) not null,
    description text null,
    created_at timestamptz not null default now()
);

create table if not exists tags (
    id serial primary key,
    name varchar(100) not null,
    description text null,
    created_at timestamptz not null default now()
);
create table if not exists courses (
    id serial primary key,
    title varchar(100) not null,
    description text null,
    tenant_id int not null,
    long_description text null,
    image_url text null,
    duration int not null default '0',
    user_id int not null,
    category_id int,
    status int not null default '0',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    foreign key (user_id) references users(id),
    foreign key (tenant_id) references tenants(id),
    foreign key (category_id) references categories(id)
);

create table if not exists courses_tags (
    id serial primary key,
    course_id int not null,
    tag_id int not null,
    foreign key (course_id) references courses(id),
    foreign key (tag_id) references tags(id)
);