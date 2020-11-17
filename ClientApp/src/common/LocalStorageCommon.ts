export const SaveState = (key: string, state: any) => {
    try {
      const serializedState = JSON.stringify(state);
      localStorage.setItem(key, serializedState);
    } catch(err) {
      console.log(err);
    }
  };