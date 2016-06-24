$(document).ready(function() {
  var products;
  var activeFilter = false;
  var editId;
  var changes = {};

  // Helpers
  var toggleActiveClasses = function(element) {
    if($(element).hasClass('active')) {
      $(element).removeClass('active')
      $(element).siblings().addClass('active')
    } else if($(element).siblings().hasClass('active')) {
      $(element).addClass('active')
      $(element).siblings().removeClass('active')
    } else {
      $(element).addClass('active')
    };
  };

  // Edit product
  var editProduct = function() {
    $('.edit-product-details').on('click', function(e) {
      if(editId === undefined || editId === $(this).closest('.product').attr('id')) {
        console.log("Product Id is being edited", $(this).closest('.product').attr('id'));
        $(this).closest('.product').addClass('active');
        editId = $(this).closest('.product').attr('id');
        changes["id"] = editId;
      } else {
        alert("Cancel or save edit in progress for product " + editId + " before editing another product.");
      };
    });
  };

  var editMoreDetail = function() {
    $('.toggle-edit-more-detail').on('click', function() {
      toggleActiveClasses($(this).parent().parent().find('.edit-more-detail'))
    });
  }

  // Cancel edit
  var cancelEdit = function() {
    $('.edit-cancel').on('click', function() {
      console.log('Cancel request')
      if(editId === $(this).closest('.product').attr('id')) {
        alert('The editing of product ' + editId + ' has been canceled.');
        $(this).closest('.product').removeClass('active');
        editId = undefined;
      } else {
        alert('This product is not being edited and cannot be canceled.');
      };
    });
  };

  // Save edit
  var saveEdit = function() {
    $('.edit-save').on('click', function() {
      console.log('Save request')
      if(editId === $(this).closest('.product').attr('id')) {
        changeProductName($(this).closest('.product'))
        changes["id"] = editId;
        alert('The editing of product ' + editId + ' has been saved.');
        $(this).closest('.product').removeClass('active');
        saveProductChanges();
      } else {
        alert('This product is not being edited and cannot be saved.');
      };
    });
  };

  // Delete product
  var selectDeleteProduct = function() {
    $('.product').on('click', '.delete', function(e) {
      e.stopPropagation();
      var id = $(this).closest('.product').attr('id');
      $(this).closest('.product').hide();
      deleteProduct(id);
    })
  }

  // Change product name
  var changeProductName = function(product) {
    changes['name'] = product.find('.edit-name').val()
    console.log("Changing product name", changes)
  }

  // Select new img fit
  var selectNewImgFit = function() {
    $('.edit-fit div').on('click', function(e) {
      if(editId === $(this).closest('.product').attr('id') || editId === undefined) {
        toggleActiveClasses($(this));
        changes['objectFit'] = $(this).attr('class').split(' ')[0];
        console.log(changes);
      } else {
        console.log("Incorrect product", changes);
      }
    });
  };

  // Select new gender
  var selectNewGender = function() {
    $('.edit-gender div').on('click', function(e) {
      if(editId === $(this).closest('.product').attr('id') || editId === undefined) {
        toggleActiveClasses($(this));
        changes['gender'] = $(this).attr('class').split(' ')[0];
        console.log(changes);
      } else {
        console.log("Incorrect product", changes);
      }
    });
  };

  //Select new category
  var selectNewCategory = function() {
    $('.category-option').on('click', function(e) {
      if(editId === $(this).closest('.product').attr('id') || editId === undefined) {
        var newCategory = $(this).attr('class').split(' ')[0];
        $(this).parent().siblings('.current-category').html(newCategory);
        changes['category'] = newCategory;
        console.log(changes);
      } else {
        console.log("Incorrect product", changes);
      }
    });
  };

  //Activate Product
  var activateProduct = function() {
    $('.edit-activation').on('click', function(e) {
      if(editId === $(this).closest('.product').attr('id') || editId === undefined) {
        var now = new Date();
        if($(this).hasClass('active')){
          changes['active'] = false;
          $(this).removeClass('active')
        } else {
          changes['active'] = true;
          changes['activeTimeStamp'] = now;
          $(this).addClass('active')
        }
        console.log(changes);
      } else {
        console.log("Incorrect product", changes);
      }
    })
  }

  // Add product to Stylist Picks
  var stylistPick = function() {
    $('.stylistPick-activation').on('click', function(e) {
      if(editId === $(this).closest('.product').attr('id') || editId === undefined) {
        if($(this).hasClass('active')){
          changes['stylistPick'] = false;
          $(this).removeClass('active')
        } else {
          changes['stylistPick'] = true;
          $(this).addClass('active')
        }
        console.log(changes);
      } else {
        console.log("Incorrect product", changes);
      }
    })
  }

  var filterActiveProducts = function(products) {
    return products.filter(function(product) {
      return product.active === true;
    })
  }

  $('.active-filter').on('click', function() {
    activeFilter === true ? activeFilter = false : activeFilter = true;
    if(activeFilter === true) {
      var activeProducts = filterActiveProducts(products);
      populateProducts({product: activeProducts});
    } else {
      populateProducts({product: products})
    }
  })

  $('.filter-women').on('click', 'div', function() {
    if($(this).attr('class') === "stylistPick") {
      requestProducts('womens-clothes', null, true)
    } else {
      requestProducts('womens-clothes', $(this).attr('class'), false);
    }
  })

  $('.filter-men').on('click', 'div', function() {
    if($(this).attr('class') === "stylistPick") {
      requestProducts('men', null, true)
    } else {
      requestProducts('men', $(this).attr('class'), false);
    }
  })

  // Handlebars Templating
  var source = $("#product-template").html();

  // Handlebars conditional helper (if / then logic)
  Handlebars.registerHelper('equal', function(lvalue, rvalue, options) {
    if (arguments.length < 3)
        throw new Error("Handlebars Helper equal needs 2 parameters");
    if( lvalue!=rvalue ) {
        return options.inverse(this);
    } else {
        return options.fn(this);
    }
  });

  // Handlebars debug helper (console.logs context)
  Handlebars.registerHelper("debug", function(optionalValue) {
    console.log("Current Context");
    console.log("====================");
    console.log(this);
    if (optionalValue) {
        console.log("Value");
        console.log("====================");
        console.log(optionalValue);
    }
  });

  // Load data with active styles
  Handlebars.registerHelper('isActive', function (input, value) {
    return input === value ? 'active' : '';
  });

  // Set category title
  var setCategoryTitle = function(category, stylistPick) {
    var categoryTitle = $('.category-title');

    if(category) {
      categoryTitle.html(category)
    } else if(stylistPick === true) {
      categoryTitle.html('StylistPick')
    } else {
      categoryTitle.html('All products')
    }
  }

  // Get request for products
  var requestProducts = function(gender, category, stylistPick) {
    setCategoryTitle(category, stylistPick);

    $.ajax({
      type: 'GET',
      url: '/admin/product-list',
      dataType: 'JSON',
      data: {
        'gender': gender,
        'category': category,
        'stylistPick': stylistPick
      }
    }).done(function(data) {
      products = data.products;
      populateProducts({product: products});
    }).fail(function(data) {
      console.log("Get request failed");
    })
  };

  requestProducts('womens-clothes', null, false)

  // Put request for saving product changes
  var saveProductChanges = function() {
    changes = JSON.stringify(changes);
    $.ajax({
      type: 'put',
      url: '/admin/product-lists/edit',
      dataType: 'json',
      data: {data: changes}
    }).done(function(data) {
      console.log('success')
      changes = {};
      editId = undefined;
    }).fail(function(err) {
      console.log(err)
      console.log(changes)
    })
  }

  // Put request for deleting a product
  var deleteProduct = function(id, parent) {
    id = JSON.stringify(id);
    console.log('id', id)
    $.ajax({
      type: 'put',
      url: '/admin/product-lists/delete',
      dataType: 'json',
      data: {data: id}
    }).done(function(data) {
      console.log('data', data)
    }).fail(function(err) {
      console.log(err)
    })
  }

  // Populate products to the view
  var populateProducts = function(products) {
    $('.products-container').empty()
    var template = Handlebars.compile(source);
    var data = products;
    var html = template(data);
    $('.products-container').append(html)
    editProduct();
    selectDeleteProduct();
    selectNewImgFit();
    selectNewGender();
    selectNewCategory();
    activateProduct();
    stylistPick();
    editMoreDetail();
    saveEdit();
    cancelEdit();
  }
})