postgresql://neondb_owner:npg_vWr18SPtcAlg@ep-shy-scene-axfq2wm3-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require

psql "postgresql://neondb_owner:npg_vWr18SPtcAlg@ep-shy-scene-axfq2wm3-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require" < backup-260129.sql


pg_restore --no-owner --no-privileges -d "postgresql://neondb_owner:npg_vWr18SPtcAlg@ep-shy-scene-axfq2wm3-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require" backup-260129.sql