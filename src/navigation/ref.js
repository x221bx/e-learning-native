import { createNavigationContainerRef, CommonActions } from '@react-navigation/native';

export const navRef = createNavigationContainerRef();

export function resetTo(routeName, params) {
  if (navRef.isReady()) {
    navRef.dispatch(
      CommonActions.reset({ index: 0, routes: [{ name: routeName, params }] })
    );
  }
}

