import React from 'react';
import SvgColor from 'src/components/svg-color';

// Function to generate icon component
const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

// Original navConfig array is removed in favor of a function that returns dynamic configuration

export const getNavConfig = (userType) => {
  switch (userType) {
    case 'student':
      return [
        {
          title: 'Dashboard',
          path: '/',
          icon: icon('ic_analytics'),
        },
      ];

    case 'teacher':
      return [
        {
          title: 'User Management',
          path: '/',
          icon: icon('ic_cart'),
        },
      ];
    default:
      return []; // Empty or some default navigation for other user types or guests
  }
};
