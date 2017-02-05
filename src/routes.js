const routes = [
  { path: '/', action: () => <ListOfFiles /> },
  { path: '/file/:id', action: () => <FullScreenFile /> }
];

export default routes;
