app.get('/workflows/:workflow_str_id/details', async (req, res) => {
  const { workflow_str_id } = req.params;

  try {
    const workflowResult = await db.query(
      'SELECT id, name FROM workflows WHERE workflow_str_id = $1',
      [workflow_str_id]
    );

    if (workflowResult.rows.length === 0) {
      return res.status(404).json({ error: 'Workflow not found' });
    }

    const workflow = workflowResult.rows[0];

    const stepsResult = await db.query(
      'SELECT id, step_str_id, description FROM steps WHERE workflow_id = $1',
      [workflow.id]
    );

    const steps = stepsResult.rows;

    const depsResult = await db.query(
      `SELECT s.step_str_id AS step, p.step_str_id AS prerequisite
       FROM dependencies d
       JOIN steps s ON d.step_id = s.id
       JOIN steps p ON d.prerequisite_step_id = p.id
       WHERE d.workflow_id = $1`,
      [workflow.id]
    );

    const depMap = {};
    depsResult.rows.forEach(dep => {
      if (!depMap[dep.step]) depMap[dep.step] = [];
      depMap[dep.step].push(dep.prerequisite);
    });

    const response = {
      workflow_str_id,
      name: workflow.name,
      steps: steps.map(step => ({
        step_str_id: step.step_str_id,
        description: step.description,
        prerequisites: depMap[step.step_str_id] || []
      }))
    };

    return res.json(response);
  } catch (err) {
    console.error('Error fetching workflow details:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});
