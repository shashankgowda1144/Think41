CREATE TABLE workflows (
  id SERIAL PRIMARY KEY,
  workflow_str_id VARCHAR UNIQUE NOT NULL,
  name VARCHAR NOT NULL
);

CREATE TABLE steps (
  id SERIAL PRIMARY KEY,
  step_str_id VARCHAR UNIQUE NOT NULL,
  workflow_id INT REFERENCES workflows(id),
  description TEXT
);

CREATE TABLE dependencies (
  id SERIAL PRIMARY KEY,
  workflow_id INT REFERENCES workflows(id),
  step_id INT REFERENCES steps(id), 
  prerequisite_step_id INT REFERENCES steps(id) 
);
