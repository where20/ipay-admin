<template>
  <div class="app-container">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="">
        <el-input v-model="formInline.account" placeholder="账号" style="width: 150px;" clearable></el-input>
      </el-form-item>
      <el-form-item label="" v-if="role === '0'?true:false">
        <el-input v-model="formInline.merchName" placeholder="商户名称" style="width: 150px;" clearable></el-input>
      </el-form-item>
      <el-form-item label="是否启用">
        <el-select v-model="formInline.status" placeholder="是否启用" style="width: 150px;" clearable>
          <el-option label="是" value="1"></el-option>
          <el-option label="否" value="0"></el-option>
        </el-select>
      </el-form-item>
  
      <el-form-item>
        <el-button type="success" @click="onSearch">查询</el-button>
        <el-button type="primary" @click="onAddAccount" v-if="role === '0'?true:false">添加</el-button>
        <!-- <el-button type="danger" @click="onSubmit">批量删除</el-button> -->
      </el-form-item>
    </el-form>
    <el-table
      v-loading="listLoading"
      ref="multipleTable"
      :data="list"
      element-loading-text="拼命加载中"
      border
      fit
      highlight-current-row>
      <el-table-column align="center" label="序号" width="50">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="商户名称">
        <template slot-scope="scope">
          {{ scope.row.merchName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="账号类型">
        <template slot-scope="scope">
          {{ accountTypeArr[scope.row.accountType] }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="账号">
        <template slot-scope="scope">
          {{ scope.row.account }}
        </template>
      </el-table-column>
       <el-table-column align="center" label="账号Id">
        <template slot-scope="scope">
          {{ scope.row.accountUserId || '-' }}
        </template>
      </el-table-column>
      <el-table-column label="账号密码" align="center">
        <template slot-scope="scope">
          {{ scope.row.accountPassword }}
        </template>
      </el-table-column>
      <el-table-column label="通信秘钥" align="center">
        <template slot-scope="scope">
          {{ scope.row.transportToken }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否启用">
        <template slot-scope="scope">
          <el-button :type="scope.row.status === 0?'danger':'success'">{{ scope.row.status === 0?"否":"是" }}</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="150">
        <template slot-scope="scope">
          <!-- <el-button size="small" type="primary">编辑</el-button> -->
          <el-button size="small" type="danger" @click="delAccount(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <el-dialog title="添加账号" :visible.sync="addAccountDialog">
      <el-form :model="form" :rules="formRules" ref="form">
        <el-form-item label="所属商户" :label-width="formLabelWidth" prop="merchId">
          <el-select v-model="form.merchId" placeholder="交易商户" style="width: 150px;" clearable>
            <el-option v-for="(item, i) in merchList" :key="i" :label="item.merchName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账号类型" :label-width="formLabelWidth" prop="accountType">
          <el-select v-model="form.accountType" placeholder="账号类型" style="width: 150px;" clearable>
            <el-option v-for="(item, i) in accountTypeArr" :key="i" :label="item" :value="i"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账号" :label-width="formLabelWidth" prop="account">
          <el-input v-model="form.account" placeholder="请输入账号"></el-input>
        </el-form-item>
        <el-form-item label="账号Id" :label-width="formLabelWidth" prop="accountUserId">
          <el-input v-model="form.accountUserId" placeholder="请输入账号Id"></el-input>
        </el-form-item>
        <el-form-item label="账号URL" :label-width="formLabelWidth" prop="accountUrl">
          <el-input v-model="form.accountUrl" placeholder="请输入账号URL"></el-input>
        </el-form-item>
        <el-form-item label="账户密码" :label-width="formLabelWidth" prop="accountPassword">
          <el-input v-model="form.accountPassword" placeholder="请输入账号密码"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addAccountDialog = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getAccount, addAccount, delAccount, changeAccountStatus } from '@/api/account'
import { getMerchList } from '@/api/merch'
import Pagination from '@/components/Pagination'

export default {
  name: 'Account',
  components: { Pagination },
  computed: {
    ...mapGetters([
      'role'
    ])
  },
  data() {
    var validateAccount = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入账号'));
      } else {
        if (this.form.account !== '') {
          var reg = /[^\u4e00-\u9fa5|,]+/
          if (!reg.test(this.form.account)) {
            callback(new Error('请输入正确的账号'));
          }
        }
        callback();
      }
    };
    var validateAccountUserId = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入账号Id'));
      } else {
        if (this.form.accountUserId !== '') {
          var reg = /^[0-9]+$/
          if (!reg.test(this.form.accountUserId)) {
            callback(new Error('请输入正确的账号Id'));
          }
        }
        callback();
      }
    };
    var validatePwd = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入账号密码'));
      } else {
        if (this.form.accountPassword !== '') {
          var reg = /[^\u4e00-\u9fa5|,]+/
          if (!reg.test(this.form.accountPassword)) {
            callback(new Error('请输入正确的账号密码'));
          }
        }
        callback();
      }
    };
    return {
      accountTypeArr: ['支付宝', '微信', 'QQ', '银联'],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 30,
      },
      list: [],
      formInline: {
        account: '',
        status: null,
        merchName: '',
      },
      addAccountDialog: false,
      formLabelWidth: '80px',
      form: {
        merchId: '',
        accountType: '',
        account: '',
        accountUserId: '',
        accountUrl: '',
        accountPassword: ''
      },
      formRules: {
        merchId: [
          { required: true, message: '请选择所属商户', trigger: 'change' }
        ],
        accountType: [
          { required: true, message: '请选择账号类型', trigger: 'change' }
        ],
        account: [
          { required: true, validator: validateAccount, trigger: 'blur' }
        ],
        accountUserId: [
          { required: true, validator: validateAccountUserId, trigger: 'blur' }
        ],
        accountUrl: [
          { required: true, message: '请输入账号URL', trigger: 'blur' }
        ],
        accountPassword: [
          { required: true, validator: validatePwd, trigger: 'blur' }
        ]
      },
      merchList: []
    }
  },
  created() {
    // console.log(getOrderList());'
    this.getList()
    this.getMerchList()
  },
  methods: {
    getList(query) {
      // var self = this;
      this.listLoading = true
      getAccount(query).then(response => {
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
    getMerchList(query) {
      getMerchList(query).then(response => {
        console.log('getMerchList', response.data)
        const data = response.data
        if(data.code == 101) {
          this.merchList = data.data
        }
      }).catch (reason => {
        console.log(reason)
      })
    },
    // 查询
    onSearch() {
      console.log('submit!', this.formInline);
      this.getList(this.formInline);
    }, 
    // 添加
    onAddAccount() {
      console.log('onAddAccount!');
      this.addAccountDialog = true;
    },
    // 添加账号
    addAccount(params) {
      console.log('addAccount', params);
      addAccount(params).then(response => {
        console.log('response123', response.data)
        const data = response.data
        if(data.code == 101) {
          this.addAccountDialog = false
          this.getList()
          this.resetForm('form')
        }
      }).catch (reason => {
        console.log(reason)
      })
    },
    // 删除账号
    delAccount(row) {
      console.log('delAccount', row);
      delAccount(row.id).then(response => {
        const data = response.data
        if(data.code == 101) {
          this.$message({
            message: '删除账号成功!',
            type: 'warning'
          });
          this.getList()
        }
      }).catch (reason => {
        console.log(reason)
      })
    },
    // 是否启用
    changeAccountStatus(row) {
      console.log('changeAccountStatus', row);
      changeAccountStatus({
        id: row.id,
        status: row.status?0:1
      }).then(response => {
        const data = response.data
        if(data.code == 101) {
          this.getList()
        }
      }).catch (reason => {
        console.log(reason)
      })
    },
    // 提交账号添加
    submitForm(formName) {
      console.log(this.form);
      var self = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.addAccount(self.form);
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
}
</script>
