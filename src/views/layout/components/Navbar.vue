<template>
  <div>
    <el-menu class="navbar" mode="horizontal">
      <hamburger :toggle-click="toggleSideBar" :is-active="sidebar.opened" class="hamburger-container"/>
      <breadcrumb />
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <span class="name">{{ name }}</span>
          <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
          <i class="el-icon-caret-bottom"/>
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link class="inlineBlock" to="/">
            <el-dropdown-item>
              首页 
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided>
            <span style="display:block;" @click="editPassword">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">登出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-menu>
    <el-dialog title="修改密码" :visible.sync="editPasswordDialog">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item label="旧密码" prop="oldPwd" :label-width="formLabelWidth">
          <el-input v-model="ruleForm.oldPwd" clearable></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPwd" :label-width="formLabelWidth">
          <el-input v-model="ruleForm.newPwd" clearable></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPwd" :label-width="formLabelWidth">
          <el-input v-model="ruleForm.checkPwd" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editPasswordDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { changePwd } from '@/api/user'
export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'name',
      'role',
      'avatar'
    ])
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'));
      } else {
        if (this.ruleForm.checkPwd !== '') {
          var reg = /[^\u4e00-\u9fa5|,]+/
          if (!reg.test(this.addUserForm.telegram)) {
            callback(new Error('请输入正确的新密码'));
          }
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.ruleForm.newPwd) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      editPasswordDialog: false,
      formLabelWidth: '80px',
      ruleForm: {
        id: '',
        oldPwd: '',
        newPwd: '',
        checkPwd: ''
      },
      rules: {
        oldPwd: [
          { required: true, message: '请输入旧密码', trigger: 'blur' },
        ],
        newPwd: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        checkPwd: [
          { required: true, validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    },
    editPassword() {
      this.editPasswordDialog = true
      console.log('userId', this.$store.state)
      this.ruleForm.id = this.$store.state.user.userId
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          changePwd({
            id: this.ruleForm.id,
            oldPwd: this.ruleForm.oldPwd,
            newPwd: this.ruleForm.newPwd,
          }).then(response => {
            console.log('changePwd', response.data)
            const data = response.data
            if(data.code == 101) {
              this.editPasswordDialog = false
              this.$message({
                message: '修改密码成功，请重新登陆!',
                type: 'success'
              });
              this.logout()
            }else if(data.code == 208) {
                this.$message({
                  message: data.message,
                  type: 'error'
                });
            }
          }).catch (reason => {
            console.log(reason)
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }
  .avatar-container {
    height: 50px;
    display: inline-block;
    position: absolute;
    right: 35px;
    .avatar-wrapper {
      cursor: pointer;
      margin-top: 5px;
      position: relative;
      .name{
        position: absolute;
        left: -90px;
        bottom: 15px;
        font-size: 30px;
      }
      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }
      .el-icon-caret-bottom {
        position: absolute;
        right: -20px;
        top: 25px;
        font-size: 12px;
      }
    }
  }
}
</style>

