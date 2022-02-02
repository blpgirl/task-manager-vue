var app = new Vue({
  el: '#app',
  data: {
    tasks: [
      { id: 1, name: 'Todo 1', description: 'This is a todo', completed: false },
      { id: 2, name: 'Todo 2', description: 'This is another todo', completed: true },
      { id: 3, name: 'Three', description: 'This is a compplete todo', completed: true },
      { id: 4, name: 'Four', description: 'This is another complete todo', completed: true }
    ],
    task: {},
    message: 'Task Manager App',
    action: 'create'
  },
  computed: {
    completedTasks: function() {
      // filter task by attribute completed true
      return this.tasks.filter( item => item.completed == true );
    },
    todoTasks: function() {
      // filter tasks by attribute completed false
      return this.tasks.filter( item => item.completed == false);
    },
    nextId: function(){
        // the return is a collection of sorted array by id and then the length and add 1
       return (this.tasks.sort(function(a,b){ return a.id - b.id; }))[this.tasks.length - 1].id + 1;
     }
  },
  components: {
    'task': {
              props: ['task'],
              template: `
              <div class="ui segment task"
                   v-bind:class="task.completed ? 'done' : 'todo' ">
                    <div class="ui grid">
                      <div class="left floated twelve wide column">
                        <div class="ui checkbox">
                          <input type="checkbox" name="task"
                              v-on:change="app.toggleDone($event, task.id)" :checked="task.completed" >
                          <label>{{ task.name }} <span class="description">{{ task.description }}</span></label>
                        </div>
                      </div>
                      <div class="right floated three wide column">
                        <i class="icon pencil blue" alt="Edit" v-on:click="app.editTask($event, task.id)"></i>
                        <i class="icon trash red" alt="Delete" v-on:click="app.deleteTask($event, task.id)"></i>
                      </div>
                    </div>
              </div>
              `
            }
  },
  methods: {
           toggleDone: function(event, id) {
             // to avoid calling the delete task as well after click on the checkbox
             event.stopImmediatePropagation();
             // find in the collection of tasks the one with the id in parameter
             let task = this.tasks.find(item => item.id == id);
               //console.log('the id of task is '+task.id+' id '+id+' completed '+task.completed );
               //console.log('evento '+event.target.checked);
             if(task) {
                  task.completed = !task.completed;
                  // for some reason was unchecking the next one and this fix it
                  event.target.checked = !task.completed;
                  this.message = `Task ${id} updated.`
                  //console.log('task toggled '+task.completed);
              }
           },
           deleteTask: function(event, id){
             event.stopImmediatePropagation();
             let taskIndex = this.tasks.findIndex(item => item.id == id);
              if(taskIndex > -1){
                this.$delete(this.tasks, taskIndex);
                this.message = `Task ${id} deleted.`
              }
          },
          editTask: function(event, id){
            event.stopImmediatePropagation();
            this.action = 'edit';
            let task = this.tasks.find(item => item.id == id);
            if(task) {
              this.task = { id: id,
                            name: task.name,
                            description: task.description,
                            completed: task.completed };
            }
          },
          updateTask: function(event, id){
            event.stopImmediatePropagation();
            //event.preventDefault();
            let task = this.tasks.find(item => item.id == id);
            if(task) {
              task.name = this.task.name;
              task.description = this.task.description;
              task.completed = this.task.completed;
              this.message = `Task ${id} updated.`
            }
          },
          clear: function (){
            this.task = {};
            this.action = 'create';
            this.message = '';
         },
         createTask: function(event) {
            //event.preventDefault();
            if(!this.task.completed){
              this.task.completed = false;
            } else {
              this.task.completed = true;
            }
            // nextId is a computed attribute
            let taskId = this.nextId;
            this.task.id = taskId;

            let newTask = Object.assign({}, this.task);
            this.tasks.push(newTask);

            this.clear();
            this.message = `Task ${taskId} created.`
          },
  },
});
