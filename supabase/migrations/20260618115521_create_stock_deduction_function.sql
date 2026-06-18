-- Create function to safely deduct stock
CREATE OR REPLACE FUNCTION deduct_order_stock(p_order_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_product_id UUID;
  v_size TEXT;
  v_quantity INTEGER;
  v_current_stock INTEGER;
  v_new_stock INTEGER;
  v_stock_deducted BOOLEAN;
  v_result JSON;
BEGIN
  -- Check if stock already deducted
  SELECT stock_deducted INTO v_stock_deducted
  FROM orders WHERE id = p_order_id;
  
  IF v_stock_deducted THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Stock already deducted for this order'
    );
  END IF;
  
  -- Get order details
  SELECT product_id, selected_size, quantity 
  INTO v_product_id, v_size, v_quantity
  FROM orders WHERE id = p_order_id;
  
  -- Get current stock
  SELECT stock INTO v_current_stock
  FROM products WHERE id = v_product_id;
  
  -- Check if enough stock
  IF v_current_stock < v_quantity THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Insufficient stock. Available: ' || v_current_stock || ', Requested: ' || v_quantity
    );
  END IF;
  
  -- Deduct stock
  v_new_stock := v_current_stock - v_quantity;
  
  UPDATE products SET stock = v_new_stock WHERE id = v_product_id;
  
  -- Mark order as stock deducted
  UPDATE orders SET stock_deducted = true WHERE id = p_order_id;
  
  RETURN json_build_object(
    'success', true,
    'previous_stock', v_current_stock,
    'new_stock', v_new_stock,
    'deducted', v_quantity
  );
END;
$$;