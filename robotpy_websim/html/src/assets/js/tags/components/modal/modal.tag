

<modal>

  <div ref="modal" class="modal" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{opts.title}</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <yield/>
      </div>
    </div>
  </div>

  <script>

    this.open = () => {
      const $modal = $(this.refs.modal);
      $modal.modal('show');
    };

    this.close = () => {
      const $modal = $(this.refs.modal);
      $modal.modal('hide');
    };

    this.isOpen = () => {

    };

    this.onShow = (callback) => {
      $(this.refs.modal).on('show.bs.modal', callback);
    }

    this.onShown = (callback) => {
      $(this.refs.modal).on('shown.bs.modal', callback);
    }

    this.onHide = (callback) => {
      $(this.refs.modal).on('hide.bs.modal', callback);
    }

    this.onHidden = (callback) => {
      $(this.refs.modal).on('hidden.bs.modal', callback);
    }

    this.on('mount', () => {
      
      const $modal = $(this.refs.modal);
      $($modal).modal({
        keyboard: false,
        show: false
      });
    });
    
    this.on('update', () => {

    });

  </script>

</modal>