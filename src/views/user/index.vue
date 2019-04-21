<template>
  <div class="app-container">
    <div class="app-container-admin" v-if="role == 0? true:false">
      <el-form :inline="true" :model="formInline">
        <el-form-item label="">
          <el-input v-model="formInline.username" placeholder="用户名称" style="width: 150px;" clearable></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="formInline.nickName" placeholder="用户昵称" style="width: 150px;" clearable></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="formInline.phone" placeholder="手机号码" style="width: 150px;" clearable></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="formInline.telegram" placeholder="小飞机号" type="tel" style="width: 150px;" clearable></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="formInline.email" placeholder="邮箱" type="tel" style="width: 150px;" clearable></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="formInline.merchName" placeholder="商户名称" type="tel" style="width: 150px;" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="onSearch">查询</el-button>
          <!-- <el-button type="primary" @click="onSubmit">添加订单</el-button>
          <el-button type="danger" @click="onSubmit">批量删除</el-button> -->
        </el-form-item>
      </el-form>
      <el-table
        v-loading="listLoading"
        ref="multipleTable"
        :data="list"
        element-loading-text="拼命加载中"
        border
        fit
        highlight-current-row
        @selection-change="handleSelectionChange">
        <el-table-column align="center" label="序号" width="50">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="用户名称">
          <template slot-scope="scope">
            {{ scope.row.username }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="用户昵称">
          <template slot-scope="scope">
            {{ scope.row.nickName }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="商户名称">
          <template slot-scope="scope">
            {{ scope.row.merchName }}
          </template>
        </el-table-column>
        <el-table-column label="邮箱" align="center">
          <template slot-scope="scope">
            {{ scope.row.email }}
          </template>
        </el-table-column>
        <el-table-column label="小飞机号" align="center">
          <template slot-scope="scope">
            {{ scope.row.telegram }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="电话号码">
          <template slot-scope="scope">
            <span>{{ scope.row.phone }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="用户角色">
          <template slot-scope="scope">
            {{ scope.row.role === "0" ? '超级用户' : '普通商户' }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="200">
          <template slot-scope="scope">
            <el-button size="small" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="resetPassWord(scope.row)">重置密码</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
      <el-dialog title="编辑用户" :visible.sync="editUserDialog">
        <el-form :model="form" :rules="formRules" ref="form">
          <el-form-item label="用户昵称" :label-width="formLabelWidth" prop="nickName">
            <el-input v-model="form.nickName"></el-input>
          </el-form-item>
          <el-form-item label="电子邮箱" :label-width="formLabelWidth" prop="email">
            <el-input v-model="form.email"></el-input>
          </el-form-item>
          <el-form-item label="小飞机号" :label-width="formLabelWidth" prop="telegram">
            <el-input v-model="form.telegram"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" :label-width="formLabelWidth" prop="phone">
            <el-input v-model="form.phone"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editUserDialog = false">取 消</el-button>
          <el-button type="primary" @click="submitForm('form')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <div class="app-container-merch" v-if="role == 1? true:false">
      {{ curUser.role }} {{ curUser.nickName }}
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getUser, editUserInfo, resetPwd } from '@/api/user'
import Pagination from '@/components/Pagination'

export default {
  name: 'User',
  components: { Pagination },
  computed: {
    ...mapGetters([
      'curUser',
      'role'
    ])
  },
  data() {
    var validateEmail = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入邮箱'));
      } else {
        if (this.form.email !== '') {
          var reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
          if (!reg.test(this.form.email)) {
            callback(new Error('请输入正确的邮箱'));
          }
        }
        callback();
      }
    };
    var validateTelegram = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入飞机号'));
      } else {
        if (this.form.telegram !== '') {
          var reg = /[^\u4e00-\u9fa5|,]+/
          if (!reg.test(this.form.telegram)) {
            callback(new Error('请输入正确的飞机号'));
          }
        }
        callback();
      }
    };
    var validatePhone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入手机号'));
      } else {
        if (this.form.phone !== '') {
          var reg = /^1(3|4|5|7|8)\d{9}$/
          if (!reg.test(this.form.phone)) {
            callback(new Error('请输入正确的手机号'));
          }
        }
        callback();
      }
    };
    return {
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
      },
      list: [],
      multipleSelection: [],
      formInline: {
        username: '',
        nickName: '',
        email: '',
        telegram: '',
        phone: '',
        merchName: ''
      },
      editUserDialog: false,
      formLabelWidth: '80px',
      form: {
        id: '',
        nickName: '',
        email: '',
        telegram: '',
        phone: ''
      },
      formRules: {
        nickName: [
          { required: true, message: '请输入用户昵称', trigger: 'change' }
        ],
        email: [
          { required: true, validator: validateEmail, trigger: 'blur' }
        ],
        telegram: [
          { required: true, validator: validateTelegram, trigger: 'blur' }
        ],
        phone: [
          { required: true, validator: validatePhone, trigger: 'blur' }
        ],
      }
    }
  },
  created() {
    // console.log(getOrderList());
    console.log(this.role, this.curUser)
    if(this.role == 0) {
      this.getList()
    }
  },
  methods: {
    resetPassWord(row) {
      resetPwd(row.id).then(response => {
        console.log('resetPassWord', response.data)
        const data = response.data
        if(data.code == 101) {
          this.$message({
            message: '重置密码成功!',
            type: 'success'
          });
          this.getList()
        }
      }).catch (reason => {
        console.log(reason)
      })
    },
    handleEdit(row) {
      console.log(row);
      this.editUserDialog = true;
      this.form.id = row.id;
      this.form.nickName = row.nickName;
      this.form.email = row.username;
      this.form.telegram = row.telegram;
      this.form.phone = row.phone;
    },
    editUser(params) {
      editUserInfo(params).then(response => {
        console.log('editUserInfo', response.data)
        const data = response.data
        if(data.code == 101) {
          this.editUserDialog = false
          this.getList()
        }
      }).catch (reason => {
        console.log(reason)
      })
    },
    getList(query) {
      // var self = this;
      this.listLoading = true
      getUser(query).then(response => {
        console.log('response123', response.data)
        const data = response.data
        if(data.code == 101) {
          this.list = data.data.bizContent
          this.total = data.data.count
          this.listLoading = false
        }
      }).catch (reason => {
        console.log(reason)
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    onSearch() {
      console.log('submit!', this.formInline);
      this.getList(this.formInline);
    },
    // 提交编辑用户
    submitForm(formName) {
      console.log(this.form);
      var self = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // this.editUser(self.form);
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
  }
}
</script>
