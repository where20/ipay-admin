const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  curUser: state => state.user.curUser,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  userId: state => state.user.userId,
  name: state => state.user.name,
  role: state => state.user.role,
  visitedViews: state => state.tagsView.visitedViews
}
export default getters
