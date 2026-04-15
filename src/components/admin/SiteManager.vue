<template>
  <div class="site-manager">
    <div class="manager-header">
      <h2>📜 脚本管理</h2>
      <div class="header-actions">
        <select v-model="selectedCategoryId" class="category-filter">
          <option value="">所有分类</option>
          <option v-for="category in localCategories" :key="category.id" :value="category.id">
            {{ category.icon }} {{ category.name }}
          </option>
        </select>
        <button @click="openAddModal" class="add-btn">
          ➕ 添加脚本
        </button>
        <button @click="handleSave" :disabled="loading" class="save-btn">
          {{ loading ? '保存中...' : '💾 保存到GitHub' }}
        </button>
      </div>
    </div>

    <div class="stats-bar">
      <div class="stat-item">
        <span class="stat-number">{{ totalSites }}</span>
        <span class="stat-label">总脚本数</span>
      </div>
      <div class="stat-item">
        <span class="stat-number">{{ localCategories.length }}</span>
        <span class="stat-label">分类数</span>
      </div>
      <div class="stat-item">
        <span class="stat-number">{{ filteredSites.length }}</span>
        <span class="stat-label">当前显示</span>
      </div>
      <div class="stat-info">
        💡 提示：选择分类后可拖拽排序，拖到页面边缘会自动滚动
      </div>
    </div>

    <div class="sites-list">
      <draggable
        v-model="currentPageSites"
        v-bind="dragOptions"
        @end="onDragEnd"
        item-key="id"
        tag="div"
        class="draggable-list"
        :class="{ 'pagination-disabled': !selectedCategoryId }"
      >
        <template #item="{ element: site }">
          <div
            :ref="el => { if (el) siteRefs[site.id] = el }"
            class="site-item"
            :class="{
              'draggable-item': selectedCategoryId,
              'highlighted': site.id === highlightedSiteId
            }"
          >
            <div class="drag-handle" v-if="selectedCategoryId" title="拖拽排序">
              ⋮⋮
            </div>
            <div class="site-info">
              <div class="site-details">
                <h3>{{ site.name }}</h3>
                <pre class="code-preview">{{ site.url }}</pre>
                <span class="site-category">
                  {{ getCategoryName(site.categoryId) }}
                </span>
              </div>
            </div>
            <div class="site-actions">
              <button @click="editSite(site)" class="edit-btn">
                ✏️ 编辑
              </button>
              <button @click="deleteSite(site)" class="delete-btn">
                🗑️ 删除
              </button>
            </div>
          </div>
        </template>
      </draggable>

      <div v-if="!selectedCategoryId" class="pagination-notice">
        💡 请选择具体分类以启用拖拽排序功能
      </div>
    </div>

    <div v-if="showAddModal || editingSite" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h3>
            {{ editingSite ? '编辑脚本' : '添加脚本' }}
            <span v-if="!editingSite && formData.categoryId" class="category-hint">
              → {{ getCategoryName(formData.categoryId) }}
            </span>
          </h3>
          <button @click="closeModal" class="close-btn">✕</button>
        </div>

        <form @submit.prevent="saveSite" class="site-form">
          <div class="form-row">
            <div class="form-group">
              <label>脚本名称 *:</label>
              <input
                v-model="formData.name"
                required
                placeholder="简述此脚本的用途"
                class="form-input"
              >
            </div>
            <div class="form-group">
              <label>所属分类 *:</label>
              <select v-model="formData.categoryId" required class="form-input">
                <option value="">请选择分类</option>
                <option v-for="category in localCategories" :key="category.id" :value="category.id">
                  {{ category.icon }} {{ category.name }}
                </option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label>脚本代码 *:</label>
            <textarea
              v-model="formData.url"
              required
              placeholder="在此处粘贴代码或指令"
              class="form-textarea code-input"
              rows="5"
            ></textarea>
          </div>

          <div class="form-actions">
            <button type="button" @click="closeModal" class="cancel-btn">取消</button>
            <button type="submit" class="submit-btn">
              {{ editingSite ? '更新' : '添加' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import draggable from 'vuedraggable'

const props = defineProps({
  categories: {
    type: Array,
    default: () => []
  },
  initialSelectedCategoryId: {
    type: String,
    default: ''
  },
  loading: {
    type: Boolean,
    default: false
  },
  highlightedSiteId: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update', 'save'])

const localCategories = ref([])
const selectedCategoryId = ref('')
const showAddModal = ref(false)
const editingSite = ref(null)
const formData = ref({ name: '', url: '', categoryId: '' })
const siteRefs = ref({})

watch(() => props.categories, (newVal) => {
  localCategories.value = JSON.parse(JSON.stringify(newVal))
}, { immediate: true, deep: true })

watch(() => props.initialSelectedCategoryId, (newVal) => {
  selectedCategoryId.value = newVal
}, { immediate: true })

watch(() => props.highlightedSiteId, async (newId) => {
  if (newId) {
    // 等待DOM更新完成
    await nextTick()
    const targetElement = siteRefs.value[newId]
    if (targetElement) {
      // 使用 setTimeout 给予浏览器足够的时间来计算布局
      setTimeout(() => {
        // 命令浏览器将此元素平滑滚动到视野中央
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 100) // 100毫秒的延迟通常足够
    }
  }
})

const syncToParent = () => {
  emit('update', localCategories.value)
}

const allSites = computed(() => {
  const sites = []
  localCategories.value.forEach(category => {
    if (category.sites) {
      category.sites.forEach(site => {
        sites.push({ ...site, categoryId: category.id })
      })
    }
  })
  return sites
})

const totalSites = computed(() => allSites.value.length)

const filteredSites = computed(() => {
  if (!selectedCategoryId.value) {
    return allSites.value
  }
  return allSites.value.filter(site => site.categoryId === selectedCategoryId.value)
})

const currentPageSites = computed({
  get() {
    return filteredSites.value
  },
  set(newSites) {
    updateSitesOrder(newSites)
  }
})

const dragOptions = computed(() => ({
  animation: 200,
  group: "sites",
  disabled: !selectedCategoryId.value,
  ghostClass: "sortable-ghost",
  scroll: true,
  forceAutoScrollFallback: true,
  scrollSensitivity: 100,
  scrollSpeed: 15,
  bubbleScroll: true
}))

const getCategoryName = (categoryId) => {
  const category = localCategories.value.find(cat => cat.id === categoryId)
  return category ? `${category.icon} ${category.name}` : '未分类'
}

const editSite = (site) => {
  editingSite.value = site
  showAddModal.value = true
  formData.value = {
    name: site.name,
    url: site.url,
    categoryId: site.categoryId
  }
}

const deleteSite = (site) => {
  if (confirm(`确定要删除脚本"${site.name}"吗？`)) {
    const category = localCategories.value.find(cat => cat.id === site.categoryId)
    if (category && category.sites) {
      category.sites = category.sites.filter(s => s.id !== site.id)
      syncToParent()
    }
  }
}

const updateSitesOrder = (newSites) => {
  if (!selectedCategoryId.value) return
  const category = localCategories.value.find(cat => cat.id === selectedCategoryId.value)
  if (!category) return
  category.sites = newSites.map(site => ({
    id: site.id,
    name: site.name,
    url: site.url,
    description: site.description || '',
    icon: site.icon || ''
  }))
  syncToParent()
}

const onDragEnd = (event) => {
  console.log('拖拽排序完成:', event)
}

const saveSite = () => {
  const category = localCategories.value.find(cat => cat.id === formData.value.categoryId)
  if (!category) {
    alert('请选择有效的分类')
    return
  }
  if (!category.sites) {
    category.sites = []
  }
  if (editingSite.value) {
    const originalCategory = localCategories.value.find(cat =>
      cat.sites && cat.sites.some(s => s.id === editingSite.value.id)
    )
    const updatedSite = {
      id: editingSite.value.id,
      name: formData.value.name,
      url: formData.value.url,
      description: '',
      icon: ''
    }
    if (originalCategory && originalCategory.id === formData.value.categoryId) {
      const siteIndex = originalCategory.sites.findIndex(s => s.id === editingSite.value.id)
      if (siteIndex !== -1) {
        originalCategory.sites[siteIndex] = updatedSite
      }
    } else {
      if (originalCategory && originalCategory.sites) {
        originalCategory.sites = originalCategory.sites.filter(s => s.id !== editingSite.value.id)
      }
      category.sites.push(updatedSite)
    }
  } else {
    const newSite = {
      id: `site-${Date.now()}`,
      name: formData.value.name,
      url: formData.value.url,
      description: '',
      icon: ''
    }
    category.sites.push(newSite)
  }
  syncToParent()
  closeModal()
}

const openAddModal = () => {
  editingSite.value = null
  showAddModal.value = true
  const defaultCategoryId = selectedCategoryId.value || (localCategories.value[0]?.id || '')
  formData.value = {
    name: '',
    url: '',
    categoryId: defaultCategoryId
  }
}

const closeModal = () => {
  showAddModal.value = false
  editingSite.value = null
  formData.value = { name: '', url: '', categoryId: '' }
}

const handleSave = async () => {
  emit('save')
}
</script>

<style scoped>
.site-manager { padding: 20px 0; }
.manager-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 20px; border-bottom: 2px solid #e9ecef; }
.manager-header h2 { color: #2c3e50; margin: 0; font-size: 24px; }
.header-actions { display: flex; align-items: center; gap: 15px; }
.category-filter { padding: 8px 12px; border: 2px solid #e1e1e1; border-radius: 4px; font-size: 14px; background: white; cursor: pointer; }
.add-btn, .save-btn { padding: 10px 20px; border: none; border-radius: 6px; font-weight: 500; cursor: pointer; transition: all 0.3s ease; }
.add-btn { background: #27ae60; color: white; }
.add-btn:hover { background: #219a52; }
.save-btn { background: #3498db; color: white; }
.save-btn:hover:not(:disabled) { background: #2980b9; }
.save-btn:disabled { background: #bdc3c7; cursor: not-allowed; }
.stats-bar { display: grid; grid-template-columns: repeat(3, 1fr) 2fr; gap: 20px; margin-bottom: 30px; align-items: center; }
.stat-item { display: flex; flex-direction: column; align-items: center; padding: 15px; background: #f8f9fa; border-radius: 8px; border: 1px solid #e9ecef; }
.stat-number { font-size: 24px; font-weight: 600; color: #3498db; }
.stat-label { font-size: 12px; color: #7f8c8d; margin-top: 5px; }
.stat-info { display: flex; align-items: center; padding: 12px 15px; background: linear-gradient(135deg, #e8f5e8, #f0f8ff); border-radius: 8px; border-left: 4px solid #27ae60; color: #2c3e50; font-size: 13px; font-weight: 500; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05); }
.sites-list { margin-bottom: 30px; }
.draggable-list { display: flex; flex-direction: column; gap: 15px; }
.pagination-notice { text-align: center; padding: 20px; background: #e8f5e8; border: 1px solid #4caf50; border-radius: 8px; color: #2e7d32; font-size: 14px; margin-top: 20px; }
.site-item { display: flex; justify-content: space-between; align-items: center; padding: 20px; background: #f8f9fa; border-radius: 8px; border: 1px solid #e9ecef; transition: all 0.3s ease, background-color 1s ease; }
.site-item:hover { box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); }
.site-item.highlighted { background-color: #e8f4fd !important; border-color: #3498db; transform: scale(1.02); box-shadow: 0 6px 20px rgba(52, 152, 219, 0.3); }
.draggable-item { cursor: move; position: relative; }
.draggable-item:hover { background: #f1f3f4; transform: translateY(-2px); box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15); }
.draggable-item.sortable-chosen { background: #e3f2fd; border-color: #2196f3; transform: rotate(1deg); }
.draggable-item.sortable-ghost { opacity: 0.5; background: #e8f5e8; border: 2px dashed #4caf50; }
.drag-handle { position: absolute; left: 8px; top: 50%; transform: translateY(-50%); color: #95a5a6; font-size: 16px; font-weight: bold; cursor: grab; padding: 8px 4px; border-radius: 4px; transition: all 0.3s ease; user-select: none; }
.drag-handle:hover { color: #3498db; background: rgba(52, 152, 219, 0.1); }
.draggable-item .site-info { margin-left: 30px; }
.site-info { display: flex; align-items: center; gap: 15px; flex: 1; overflow: hidden; }
.site-details { flex: 1; overflow: hidden; }
.site-details h3 { margin: 0 0 8px 0; color: #2c3e50; font-size: 16px; }
.code-preview { background-color: #e9ecef; padding: 8px 12px; border-radius: 4px; font-family: 'Fira Code', 'Courier New', monospace; font-size: 13px; color: #495057; white-space: pre-wrap; word-break: break-all; margin: 0 0 8px 0; }
.site-category { display: inline-block; background: #3498db; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 500; }
.site-actions { display: flex; gap: 10px; }
.edit-btn, .delete-btn { padding: 6px 12px; border: none; border-radius: 4px; cursor: pointer; font-size: 12px; transition: all 0.3s ease; }
.edit-btn { background: #f39c12; color: white; }
.edit-btn:hover { background: #e67e22; }
.delete-btn { background: #e74c3c; color: white; }
.delete-btn:hover { background: #c0392b; }
.modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.modal-content { background: white; border-radius: 8px; width: 90%; max-width: 700px; max-height: 90vh; overflow-y: auto; }
.modal-header { display: flex; justify-content: space-between; align-items: center; padding: 20px; border-bottom: 1px solid #e9ecef; }
.modal-header h3 { margin: 0; color: #2c3e50; }
.category-hint { font-size: 14px; color: #3498db; background: #e8f4fd; padding: 4px 8px; border-radius: 12px; font-weight: 400; }
.close-btn { background: none; border: none; font-size: 20px; cursor: pointer; color: #7f8c8d; }
.site-form { padding: 20px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px; }
.form-group { margin-bottom: 20px; }
.form-group label { display: block; margin-bottom: 8px; color: #555; font-weight: 500; }
.form-input, .form-textarea { width: 100%; padding: 10px; border: 2px solid #e1e1e1; border-radius: 4px; font-size: 14px; transition: border-color 0.3s ease; }
.form-input:focus, .form-textarea:focus { outline: none; border-color: #3498db; }
.form-textarea { resize: vertical; font-family: inherit; }
.code-input { font-family: 'Fira Code', 'Courier New', monospace; background-color: #f8f9fa; color: #2c3e50; }
.form-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef; }
.cancel-btn, .submit-btn { padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; font-weight: 500; transition: background-color 0.3s ease; }
.cancel-btn { background: #95a5a6; color: white; }
.submit-btn { background: #27ae60; color: white; }
@media (max-width: 768px) {
  .manager-header { flex-direction: column; align-items: flex-start; gap: 15px; }
  .stats-bar { grid-template-columns: 1fr 1fr; }
  .stat-info { grid-column: 1 / -1; }
  .site-item { flex-direction: column; align-items: flex-start; gap: 15px; }
  .form-row { grid-template-columns: 1fr; }
}
</style>
