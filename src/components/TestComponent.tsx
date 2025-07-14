import React from 'react';

const TestComponent: React.FC = () => {
  return (
    <div style={{ 
      backgroundColor: 'red', 
      color: 'white', 
      padding: '20px', 
      fontSize: '24px',
      textAlign: 'center',
      position: 'fixed',
      top: '0',
      left: '0',
      right: '0',
      zIndex: 9999
    }}>
      🚨 TEST COMPONENT - IF YOU SEE THIS, HOT RELOAD IS WORKING! 🚨
    </div>
  );
};

export default TestComponent; 