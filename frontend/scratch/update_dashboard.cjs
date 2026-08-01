const fs = require('fs');
let code = fs.readFileSync('src/pages/caregiver/Dashboard/CaregiverDashboard.jsx', 'utf8');

// 1. Remove const ACTIVITY = [...]
code = code.replace(/\/\/ ── Activity Feed.*?const ACTIVITY = \[\n.*?\];\n/s, '');

// 2. Remove const [tasks, setTasks] = useState([...])
code = code.replace(/\/\/ Tasks \(static demo.*?const \[tasks, setTasks\] = useState\(\[.*?\]\);\n/s, 'const [tasks, setTasks] = useState([]);\n  const [recentActivity, setRecentActivity] = useState([]);\n');

// 3. Update stats state
code = code.replace(/const \[stats, setStats\]           = useState\(\{ total_residents: 0, logs_today: 0, pending_tasks: 0, urgent_count: 0 \}\);/, 
  'const [stats, setStats]           = useState({ total_residents: 0, logs_today: 0, pending_tasks: 0, urgent_count: 0, pendingTasksList: [], recentActivity: [] });');

// 4. Update load function
code = code.replace(/setStats\(statsData\);\n        setResidents\(residentsData\);/, 
  `setStats(statsData);
        if (statsData.pendingTasksList) {
          setTasks(statsData.pendingTasksList.map((p, i) => ({
            id: p.id,
            title: 'Log health for ' + p.name,
            time: 'Required Today',
            done: false
          })));
        }
        if (statsData.recentActivity) {
          setRecentActivity(statsData.recentActivity);
        }
        setResidents(residentsData);`);

// 5. Update ACTIVITY map
code = code.replace(/\{ACTIVITY\.map\(\(item, idx\) => \(\n.*?<div className=\"activity-line\" \/>\}\n.*?<\/div>\n.*?\)\)\}/s, 
  `{recentActivity.length === 0 ? (
                <p style={{ color: '#64748b', fontSize: '13px' }}>No recent activity.</p>
              ) : recentActivity.map((act, idx) => (
                <div key={act.id} className="activity-item">
                  <div className="activity-icon teal">
                    <FileText size={16} />
                  </div>
                  <div className="activity-content">
                    <div className="activity-header">
                      <span className="activity-title">Health Log for {act.elder_name}</span>
                      <span className="activity-time">{formatDate(act.logged_at)}</span>
                    </div>
                    <p className="activity-desc">{act.overall_condition}</p>
                  </div>
                  {idx < recentActivity.length - 1 && <div className="activity-line" />}
                </div>
              ))}`);

fs.writeFileSync('src/pages/caregiver/Dashboard/CaregiverDashboard.jsx', code);
console.log('Update complete');
