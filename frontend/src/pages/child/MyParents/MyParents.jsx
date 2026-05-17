import React from 'react';
import ChildLayout from '../../../layouts/ChildLayout';

const MyParents = () => {
  return (
    <ChildLayout title="My Parents">
      <div style={{ padding: '2rem', background: '#fff', borderRadius: '20px' }}>
        <h2>My Parents</h2>
        <p>This is a placeholder page for My Parents. You will be able to manage your parents' profiles here.</p>
      </div>
    </ChildLayout>
  );
};

export default MyParents;
