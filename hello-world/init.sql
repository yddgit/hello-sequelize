--创建数据库用户名和口令，并授予test数据库的所有操作权限
grant all privileges on test.* to 'www'@'%' identified by 'www';
--切换当前数据为test
use test;
--创建pets表
create table pets (
    id varchar(50) not null,
    name varchar(100) not null,
    gender bool not null,
    birth varchar(10) not null,
    createdAt bigint not null,
    updatedAt bigint not null,
    version bigint not null,
    primary key (id)
) engine=innodb;