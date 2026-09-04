GRANT SELECT ON public.product_links TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.product_links TO authenticated;
GRANT ALL ON public.product_links TO service_role;